import Peer, { PeerJSOption, DataConnection } from "peerjs";
import EventEmitter from "eventemitter3";

export interface PeerChatOptions {
  peerjs?: PeerJSOption;
  retryCount?: number;
  heartbeatInterval?: number;
  maxHeartbeatWait?: number;
}

export enum MessageType {
  HEARTBEAT = "h",
  KNOCKKNOCK = "k",
  MESSAGE = "m",
  QUIT = "q",
  RENAME = "n"
}

export interface Message {
  to?: string;
  msg: string;
  meta?: string;
}

interface RawMessage {
  t: MessageType;
  a?: string[];
  d?: string;
  m?: string;
}

const NEW = "noob";

interface EnsurePeerChatOptions {
  peerjs: PeerJSOption;
  retryCount: number;
  heartbeatInterval: number;
  maxHeartbeatWait: number;
}

export class PeerChat extends EventEmitter {
  peer: Peer;

  private _peerId = "";
  private _retryCount: number;
  private _config: EnsurePeerChatOptions;

  private _conns: Record<string, DataConnection> = {};

  private _log: (msg: string) => void;

  constructor(config: PeerChatOptions) {
    super();

    this._config = {
      peerjs: {},
      retryCount: 5,
      heartbeatInterval: 10000, // 10s
      maxHeartbeatWait: 50000, // 50s
      ...config
    };

    this._retryCount = this._config.retryCount;

    this.peer = new Peer({
      debug: process.env.NODE_ENV === "production" ? 0 : 3,
      ...this._config.peerjs
    });
    this.peer.on("open", id => {
      if (this._peerId && this._peerId !== id) {
        for (const peer in this._conns) {
          this._conns[peer].send({ t: MessageType.RENAME, d: id });
        }
      }
      this.emit("open", { previous: this._peerId, id });
      this._peerId = id;
      this._retryCount = this._config.retryCount;
    });
    this.peer.on("connection", conn => {
      this._addConn(conn, true);
    });
    this.peer.on("disconnected", () => {
      if (this._retryCount > 0) {
        this._retryCount -= 1;
        this._log("Disconnected, retrying after 5 secs...");
        setTimeout(() => {
          this.peer.reconnect();
        }, 5000);
      } else {
        this._log("Failed to reconnect");
        this.emit("error", { err: "disconnected" });
      }
    });
    this.peer.on("error", err => {
      this.emit("error", { err });
    });

    if (process.env.NODE_ENV === "production") {
      /*eslint-disable no-unused-vars*/
      /*eslint-disable @typescript-eslint/no-unused-vars*/
      this._log = _ => null;
      /*eslint-enable no-unused-vars*/
      /*eslint-enable @typescript-eslint/no-unused-vars*/
    } else {
      this._log = console.log;
    }
  }

  connect(peer: string) {
    this._addConn(this.peer.connect(peer), false);
  }

  send({ to, msg, meta }: Message) {
    if (!to) {
      let cnt = 0;
      for (const peer in this._conns) {
        cnt += this.send({ to: peer, msg, meta });
      }
      return cnt;
    } else {
      if (this._conns[to]) {
        if (meta) {
          this._conns[to].send({ t: MessageType.MESSAGE, d: msg, m: meta });
        } else {
          this._conns[to].send({ t: MessageType.MESSAGE, d: msg });
        }
        return 1;
      }
      return 0;
    }
  }

  private _addConn(conn: DataConnection, incoming: boolean) {
    const heart = setInterval(() => {
      this._log(`me: knock-knock -> ${conn.peer}`);
      conn.send({ t: MessageType.HEARTBEAT });
    }, this._config.maxHeartbeatWait);
    const cleanup = () => {
      delete this._conns[conn.peer];
      this.emit("left", { who: conn.peer });
      this._log(`${conn.peer}: beeeeeeeep`);
      clearInterval(heart);
      conn.close();
    };
    let detector = setTimeout(cleanup, this._config.maxHeartbeatWait);
    let who = "";
    conn.on("open", () => {
      conn.send({ t: MessageType.HEARTBEAT, d: incoming ? "" : NEW });
      who = conn.peer;
    });
    conn.on("close", () => cleanup());
    conn.on("error", err => this.emit("error", { who: conn.peer, err }));
    conn.on("data", ({ t, a, d, m }: RawMessage) => {
      this._log(`Data: ${t}, ${a}, ${d}, ${m}`);
      clearTimeout(detector);
      detector = setTimeout(cleanup, this._config.maxHeartbeatWait);
      switch (t) {
        case MessageType.RENAME: // brokering id is changed
          {
            const old = who;
            if (!d) {
              this._log(`Strange packet: ${{ t, d }}`);
              break;
            }
            delete this._conns[who];
            this._conns[d] = conn;
            who = d;
            this.emit("renamed", { who: old, to: d });
          }
          break;
        case MessageType.KNOCKKNOCK: // knock-knock, list of alive peers
          {
            const peers = a === undefined ? [] : a;
            const leftPeers = Object.keys(this._conns).filter(
              (peer: string) => !peers.includes(peer) && peer !== who
            );
            for (const peer of peers) {
              if (peer !== this.peer.id && !this._conns[peer]) {
                const c = this.peer.connect(peer);
                this._addConn(c, false);
              }
            }
            if (leftPeers.length > 0) {
              conn.send({ t: MessageType.KNOCKKNOCK, a: leftPeers });
            }
          }
          break;
        case MessageType.HEARTBEAT: // heartbeat
          // first heartbeat
          if (!this._conns[conn.peer]) {
            this._conns[conn.peer] = conn;
            this.emit("entered", { who, noob: d === NEW });
            conn.send({
              t: MessageType.KNOCKKNOCK,
              a: Object.keys(this._conns)
            });
          }
          console.log(`${conn.peer}: pit-a-pat`);
          break;
        case "m": // message
          this.emit("received", { who, msg: d, meta: m });
          break;
        case "q": // quit
          console.log(`${who}: quit`);
          clearTimeout(detector);
          cleanup();
          break;
      }
    });
  }

  get peers(): string[] {
    return Object.keys(this._conns);
  }

  destroy() {
    this.emit("destroyed");
    for (const peer in this._conns) {
      this._conns[peer].close();
    }
    this._conns = {};
    this.peer.destroy();
    this._log("destroyed");
  }
}

let peer: PeerChat | null = null;
let latestConfig: PeerChatOptions;

export default (config?: PeerChatOptions) => {
  if (config) latestConfig = config;
  if (!peer || peer.peer.destroyed) {
    peer = new PeerChat(latestConfig);
  }
  return peer;
};
