(function () {
    'use strict';

    window.SimpleRemote = {
      opened: function () {
        this.hammer.init(document.querySelector('.swipe-area'));
        this.socket.send('Player.GetActivePlayers', 'getActivePlayers');
      },
      received: function (data) {
        var data = JSON.parse(event.data),
            playerid;

        if(data) {
          if(data.result) {
            if(data.id === 'getActivePlayers' && data.result.length) {
              playerid = data.result[0].playerid;
              SimpleRemote.players[playerid] = new SimpleRemote.player(playerid);
              SimpleRemote.socket.send('Player.GetProperties', playerid, { playerid: playerid, properties: ['speed'] });
            }

            if(data.result && data.result.speed !== undefined && SimpleRemote.players[data.id]) {
              if(data.result.speed === 0) {
                SimpleRemote.players[data.id].paused();
              } else {
                SimpleRemote.players[data.id].playing();
              }
            }
          }

          if(data.method) {
            switch(data.method) {
              case 'Player.OnPlay':
                SimpleRemote.players[data.params.data.player.playerid].playing();
              break;

              case 'Player.OnPause':
                SimpleRemote.players[data.params.data.player.playerid].paused();
              break;
            }
          }
        }
      },
      closed: function () {
        this.hammer.destroy();

        //document.body.removeEventListener('click', bodyClick);
        backButton.removeEventListener('click', backClick);
        homeButton.removeEventListener('click', homeClick);

        // If socket is closed, attempt to reconnect
        setTimeout(SimpleRemote.init, 5000);
      },
      /*bind: function () {

      },*/
      onBack: function () {
        this.socket.send('Input.Back');
      },
      onHome: function () {
        this.socket.send('Input.Home');
      },
      init: function () {
        var backButton = document.querySelector('.back'),
            homeButton = document.querySelector('.home');

        this.simpleRemoteElement = document.getElementById('simple-remote');
        this.socket.open('ws://192.168.1.111:9090/jsonrpc', this.opened.bind(this), this.received.bind(this), this.closed.bind(this));

        //SimpleRemote..player.init();

        backButton.addEventListener('click', this.onBack.bind(this));
        homeButton.addEventListener('click', this.onHome.bind(this));
      },
      destroy: function () {

      }
    };
}());
