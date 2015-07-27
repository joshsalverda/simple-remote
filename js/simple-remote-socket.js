(function () {
  'use strict';

  window.SimpleRemote = window.SimpleRemote || {};

  window.SimpleRemote.socket = {
    open: function (endpoint, opened, received, closed) {
      this.socket = new WebSocket(endpoint);
      this.socket.onopen = opened;
      this.socket.onmessage = received;
      this.socket.onclose = closed;
    },
    send: function (method, id, params) {
      var message = {
        jsonrpc: '2.0',
        method: method,
        id: id || 0
      };

      if(params) {
        message.params = params;
      }

      this.socket.send(JSON.stringify(message));
    }
  };
}());
