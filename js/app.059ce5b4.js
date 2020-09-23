(function(e){function n(n){for(var r,s,i=n[0],a=n[1],u=n[2],d=0,p=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&p.push(o[s][0]),o[s]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);l&&l(n);while(p.length)p.shift()();return c.push.apply(c,u||[]),t()}function t(){for(var e,n=0;n<c.length;n++){for(var t=c[n],r=!0,i=1;i<t.length;i++){var a=t[i];0!==o[a]&&(r=!1)}r&&(c.splice(n--,1),e=s(s.s=t[0]))}return e}var r={},o={app:0},c=[];function s(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.m=e,s.c=r,s.d=function(e,n,t){s.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,n){if(1&n&&(e=s(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)s.d(t,r,function(n){return e[n]}.bind(null,r));return t},s.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(n,"a",n),n},s.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},s.p="/PeerChat/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],a=i.push.bind(i);i.push=n,i=i.slice();for(var u=0;u<i.length;u++)n(i[u]);var l=a;c.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("cd49")},"034f":function(e,n,t){"use strict";var r=t("85ec"),o=t.n(r);o.a},"5e11":function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id="5e11"},"85ec":function(e,n,t){},cd49:function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var r,o=t("2b0e"),c=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[e.errMsg?t("span",[e._v(e._s(e.errMsg))]):e._e(),t("section",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.remoteId,expression:"remoteId"}],attrs:{type:"text",placeholder:"Remote peer's name"},domProps:{value:e.remoteId},on:{keyup:function(n){return!n.type.indexOf("key")&&e._k(n.keyCode,"enter",13,n.key,"Enter")?null:e.connect(n)},input:function(n){n.target.composing||(e.remoteId=n.target.value)}}}),t("button",{on:{click:e.connect}},[e._v("Connect")])]),t("section",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.message,expression:"message"}],attrs:{type:"text",placeholder:"Type what you want to say"},domProps:{value:e.message},on:{keyup:function(n){return!n.type.indexOf("key")&&e._k(n.keyCode,"enter",13,n.key,"Enter")?null:e.send(n)},input:function(n){n.target.composing||(e.message=n.target.value)}}})]),t("section",[t("h2",[e._v("Peers")]),t("ul",[t("li",[e._v(e._s(e.peerId))]),e._l(e.peers,(function(n,r){return t("li",{key:r},[e._v(e._s(n))])}))],2)]),t("section",[t("h2",[e._v("Chat")]),t("ul",e._l(e.messages,(function(n,r){return t("li",{key:r},[e._v(e._s(n))])})),0)])])},s=[],i=(t("99af"),t("d4ec")),a=t("bee2"),u=t("262e"),l=t("2caf"),d=t("9ab4"),p=t("60a3"),f=(t("4de4"),t("caad"),t("b64b"),t("2532"),t("b85c")),h=t("5530"),v=t("a0bc"),g=t.n(v),m=t("ba10"),_=t.n(m);(function(e){e["HEARTBEAT"]="h",e["KNOCKKNOCK"]="k",e["MESSAGE"]="m",e["QUIT"]="q",e["RENAME"]="n"})(r||(r={}));var b,y="noob",k=function(e){Object(u["a"])(t,e);var n=Object(l["a"])(t);function t(e){var o;return Object(i["a"])(this,t),o=n.call(this),o._peerId="",o._conns={},o._config=Object(h["a"])({peerjs:{},retryCount:5,heartbeatInterval:1e4,maxHeartbeatWait:5e4},e),o._retryCount=o._config.retryCount,o.peer=new g.a(Object(h["a"])({debug:0},o._config.peerjs)),o.peer.on("open",(function(e){if(o._peerId&&o._peerId!==e)for(var n in o._conns)o._conns[n].send({t:r.RENAME,d:e});o.emit("open",{previous:o._peerId,id:e}),o._peerId=e,o._retryCount=o._config.retryCount})),o.peer.on("connection",(function(e){o._addConn(e,!0)})),o.peer.on("disconnected",(function(){o._retryCount>0?(o._retryCount-=1,o._log("Disconnected, retrying after 5 secs..."),setTimeout((function(){o.peer.reconnect()}),5e3)):(o._log("Failed to reconnect"),o.emit("error",{err:"disconnected"}))})),o.peer.on("error",(function(e){o.emit("error",{err:e})})),o._log=function(e){return null},o}return Object(a["a"])(t,[{key:"connect",value:function(e){this._addConn(this.peer.connect(e),!1)}},{key:"send",value:function(e){var n=e.to,t=e.msg,o=e.meta;if(n)return this._conns[n]?(o?this._conns[n].send({t:r.MESSAGE,d:t,m:o}):this._conns[n].send({t:r.MESSAGE,d:t}),1):0;var c=0;for(var s in this._conns)c+=this.send({to:s,msg:t,meta:o});return c}},{key:"_addConn",value:function(e,n){var t=this,o=setInterval((function(){t._log("me: knock-knock -> ".concat(e.peer)),e.send({t:r.HEARTBEAT})}),this._config.maxHeartbeatWait),c=function(){delete t._conns[e.peer],t.emit("left",{who:e.peer}),t._log("".concat(e.peer,": beeeeeeeep")),clearInterval(o),e.close()},s=setTimeout(c,this._config.maxHeartbeatWait),i="";e.on("open",(function(){e.send({t:r.HEARTBEAT,d:n?"":y}),i=e.peer})),e.on("close",(function(){return c()})),e.on("error",(function(n){return t.emit("error",{who:e.peer,err:n})})),e.on("data",(function(n){var o=n.t,a=n.a,u=n.d,l=n.m;switch(t._log("Data: ".concat(o,", ").concat(a,", ").concat(u,", ").concat(l)),clearTimeout(s),s=setTimeout(c,t._config.maxHeartbeatWait),o){case r.RENAME:var d=i;if(!u){t._log("Strange packet: ".concat({t:o,d:u}));break}delete t._conns[i],t._conns[u]=e,i=u,t.emit("renamed",{who:d,to:u});break;case r.KNOCKKNOCK:var p,h=void 0===a?[]:a,v=Object.keys(t._conns).filter((function(e){return!h.includes(e)&&e!==i})),g=Object(f["a"])(h);try{for(g.s();!(p=g.n()).done;){var m=p.value;if(m!==t.peer.id&&!t._conns[m]){var _=t.peer.connect(m);t._addConn(_,!1)}}}catch(b){g.e(b)}finally{g.f()}v.length>0&&e.send({t:r.KNOCKKNOCK,a:v});break;case r.HEARTBEAT:t._conns[e.peer]||(t._conns[e.peer]=e,t.emit("entered",{who:i,noob:u===y}),e.send({t:r.KNOCKKNOCK,a:Object.keys(t._conns)})),console.log("".concat(e.peer,": pit-a-pat"));break;case"m":t.emit("received",{who:i,msg:u,meta:l});break;case"q":console.log("".concat(i,": quit")),clearTimeout(s),c();break}}))}},{key:"destroy",value:function(){for(var e in this.emit("destroyed"),this._conns)this._conns[e].close();this._conns={},this.peer.destroy(),this._log("destroyed")}},{key:"peers",get:function(){return Object.keys(this._conns)}}]),t}(_.a),O=null,w=function(e){return e&&(b=e),O&&!O.peer.destroyed||(O=new k(b)),O},j=function(e){Object(u["a"])(t,e);var n=Object(l["a"])(t);function t(){var e;return Object(i["a"])(this,t),e=n.apply(this,arguments),e.peerId="",e.errMsg="",e.remoteId="",e.peers=[],e.messages=[],e.message="",e.$peer=w(),e}return Object(a["a"])(t,[{key:"created",value:function(){var e=this;console.log("created"),this.peerId=this.$peer.peer.id,this.$peer.on("open",(function(n){var t=n.id;e.peerId=t})),this.$peer.on("error",(function(n){var t=n.who,r=n.err;e.errMsg=t?"".concat(t,": ").concat(r):r})),this.$peer.on("entered",(function(n){var t=n.who,r=n.noob;e.peers=e.$peer.peers,r&&e.messages.unshift("".concat(t," is entered"))})),this.$peer.on("left",(function(n){var t=n.who;e.peers=e.$peer.peers,e.messages.unshift("".concat(t," is left"))})),this.$peer.on("received",(function(n){var t=n.who,r=n.msg;e.messages.unshift("".concat(t,": ").concat(r))}))}},{key:"connect",value:function(){this.$peer.connect(this.remoteId),this.remoteId=""}},{key:"send",value:function(){this.messages.unshift("".concat(this.peerId,": ").concat(this.message)),this.$peer.send({msg:this.message}),this.message=""}}]),t}(p["b"]);j=Object(d["a"])([Object(p["a"])({})],j);var C=j,E=C,I=(t("034f"),t("2877")),T=Object(I["a"])(E,c,s,!1,null,null,null),x=T.exports,N=t("9483");Object(N["a"])("".concat("/PeerChat/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var A=w({});o["a"].config.productionTip=!1,new o["a"]({render:function(e){return e(x)},destroyed:function(){A.destroy()}}).$mount("#app")}});
//# sourceMappingURL=app.059ce5b4.js.map