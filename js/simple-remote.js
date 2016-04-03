(function (context) {
  'use strict';

  context.SimpleRemote = {
    opened: function () {
      this.hammer.init(document.querySelector('.swipe-area'));
      this.socket.send('Player.GetActivePlayers', 'getActivePlayers');
    },
    activePlayer: null,
    getActivePlayer: function () {
      return this.players[this.activePlayer];
    },
    received: function (data) {
      var data = JSON.parse(event.data),
          players,
          playerid,
          playerCount;

      if(data) {
        if(data.result) {
          if(data.id === 'getActivePlayers' && data.result.length) {
            SimpleRemote.activePlayer = data.result[0].playerid;
            players = data.result;
            for(playerCount = 0; playerCount < players.length; playerCount++) {
              playerid = players[playerCount].playerid;
              SimpleRemote.players[playerid] = new SimpleRemote.Player(playerid);
              SimpleRemote.socket.send('Player.GetProperties', playerid, { playerid: playerid, properties: ['speed', 'type'] });
            }
          }

          if(data.result && data.result.speed != null && SimpleRemote.players[data.id]) {
            SimpleRemote.players[data.id].update(data.result);
          }
        }

        if(data.method) {
          switch(data.method) {
            case 'Player.OnStop':
              SimpleRemote.players = {};
              SimpleRemote.activePlayer = null;
            case 'Player.OnPlay':
            case 'Player.OnPause':
              this.socket.send('Player.GetActivePlayers', 'getActivePlayers');
            break;

            case 'Input.OnInputRequested':
              this.input.init();
            break;

            case 'Input.OnInputFinished':
              this.input.destroy();
            break;
          }
        }
      }
    },
    closed: function (destroy) {
      // If socket is closed, attempt to reconnect
      setTimeout(SimpleRemote.init.bind(this), 5000);
    },
    init: function () {
      this.simpleRemoteElement = document.getElementById('simple-remote');
      preventGhosts(this.simpleRemoteElement);
      this.socket.open('ws://' + window.location.hostname + ':9090/jsonrpc', this.opened.bind(this), this.received.bind(this), this.closed.bind(this));
    },
    destroy: function () {
      this.hammer.destroy();
      this.socket.destroy();
    }
  };
}(this));
