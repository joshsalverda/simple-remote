(function (context) {
  'use strict';

  if(!context.SimpleRemote) {
    context.SimpleRemote = {};
  }

  var SimpleRemote = context.SimpleRemote;
  SimpleRemote.players = SimpleRemote.players || {};

  SimpleRemote.Player = function (playerid) {
    var self = this,
        Property = function () {
          var _property = null;

          return function (value) {
            if(value != null) {
              _property = value;
            } else {
              return _property;
            }
          }
        };

    self.type = new Property();
    self.speed = new Property();

    self.playing = function () {
      return self.speed() !== 0;
    };

    self.paused = function () {
      return self.speed() === 0;
    };

    self.update = function (data) {
      self.type(data.type);
      self.speed(data.speed);
    };

    self.playPause = function () {
      SimpleRemote.socket.send('Player.PlayPause', playerid, { playerid: playerid });
    };

    self.stop = function () {
      SimpleRemote.socket.send('Player.Stop', playerid, { playerid: playerid });
    };

    self.smallforward = function () {
      SimpleRemote.socket.send('Player.Seek', playerid, { playerid: playerid, value: 'smallforward' });
    };

    self.setSpeed = function (speed) {
      SimpleRemote.socket.send('Player.SetSpeed', playerid, { playerid: playerid, speed: speed });
      SimpleRemote.socket.send('Player.GetActivePlayers', 'getActivePlayers');
    };

    self.incrementSpeed = function () {
      self.setSpeed('increment');
    };

    self.smallbackward = function () {
      SimpleRemote.socket.send('Player.Seek', playerid, { playerid: playerid, value: 'smallbackward' });
    };

    self.decrementSpeed = function () {
      self.setSpeed('decrement');
    };
  };
}(this));
