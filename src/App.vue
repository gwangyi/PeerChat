<template>
  <div id="app">
    <span v-if="errMsg">{{ errMsg }}</span>
    <section>
      <input
        type="text"
        v-model="remoteId"
        @keyup.enter="connect"
        placeholder="Remote peer's name"
      />
      <button @click="connect">Connect</button>
    </section>
    <section>
      <input
        type="text"
        v-model="message"
        @keyup.enter="send"
        placeholder="Type what you want to say"
      />
    </section>
    <section>
      <h2>Peers</h2>
      <ul>
        <li>{{ peerId }}</li>
        <li v-for="(peer, i) in peers" :key="i">{{ peer }}</li>
      </ul>
    </section>
    <section>
      <h2>Chat</h2>
      <ul>
        <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import getPeer from "./peer";

@Component({})
export default class App extends Vue {
  peerId = "";
  errMsg = "";
  remoteId = "";
  peers: string[] = [];
  messages: string[] = [];
  message = "";

  private $peer = getPeer();

  created() {
    console.log("created");
    this.peerId = this.$peer.peer.id;
    this.$peer.on("open", ({ id }: { id: string }) => {
      this.peerId = id;
    });
    this.$peer.on("error", ({ who, err }: { who?: string; err: string }) => {
      if (who) {
        this.errMsg = `${who}: ${err}`;
      } else {
        this.errMsg = err;
      }
    });
    this.$peer.on(
      "entered",
      ({ who, noob }: { who: string; noob: boolean }) => {
        this.peers = this.$peer.peers;
        if (noob) {
          this.messages.unshift(`${who} is entered`);
        }
      }
    );
    this.$peer.on("left", ({ who }: { who: string }) => {
      this.peers = this.$peer.peers;
      this.messages.unshift(`${who} is left`);
    });
    this.$peer.on("received", ({ who, msg }: { who: string; msg: string }) => {
      this.messages.unshift(`${who}: ${msg}`);
    });
  }

  connect() {
    this.$peer.connect(this.remoteId);
    this.remoteId = "";
  }

  send() {
    this.messages.unshift(`${this.peerId}: ${this.message}`);
    this.$peer.send({ msg: this.message });
    this.message = "";
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
