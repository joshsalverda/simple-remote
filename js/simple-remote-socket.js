(function (context) {
  'use strict';

  if(!context.SimpleRemote) {
    context.SimpleRemote = {};
  }

  var SimpleRemote = context.SimpleRemote;

  SimpleRemote.socket = {
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
    },
    destroy: function () {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.close();
    }
  };
}(this));
