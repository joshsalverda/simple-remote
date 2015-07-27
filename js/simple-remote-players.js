(function () {
  'use strict';

  window.SimpleRemote = window.SimpleRemote || {};
  window.SimpleRemote.players = {};

  window.SimpleRemote.player = function (playerid) {
    var self = this,
        playPause,
        stop,
        forward,
        backward,
        init,
        destroy;

    self.playing = function () {
      self.playPauseElement.classList.remove('fa-play');
      self.playPauseElement.classList.add('fa-pause');
      SimpleRemote.simpleRemoteElement.classList.add('playing');
    };

    self.paused = function () {
      self.playPauseElement.classList.remove('fa-pause');
      self.playPauseElement.classList.add('fa-play');
      SimpleRemote.simpleRemoteElement.classList.add('playing');
    };

    self.stopped = function () {
      SimpleRemote.simpleRemoteElement.classList.remove('playing');
    };

    playPause = function () {
      SimpleRemote.socket.send('Player.PlayPause', 0, { playerid: playerid });
    };

    stop = function () {
      self.stopped();
      SimpleRemote.socket.send('Player.Stop', 0, { playerid: playerid });
    };

    forward = function () {
      SimpleRemote.socket.send('Player.Seek', 0, { playerid: playerid, value: 'smallforward' });
    };

    backward = function () {
      SimpleRemote.socket.send('Player.Seek', 0, { playerid: playerid, value: 'smallbackward' });
    };

    init = function () {
      var playerControls = document.querySelector('.player-controls'),
          controlTemplate = playerControls.querySelector('.control'),
          controls = controlTemplate.cloneNode(true);

      playerControls.appendChild(controls);

      self.heading = controls.querySelector('h2');
      self.playPauseElement = controls.querySelector('.play-pause button');
      self.stopElement = controls.querySelector('.stop button');
      self.forwardElement = controls.querySelector('.skip-forward button');
      self.backElement = controls.querySelector('.skip-back button');

      self.playPauseElement.addEventListener('click', playPause);
      self.stopElement.addEventListener('click', stop);
      self.forwardElement.addEventListener('click', forward);
      self.backElement.addEventListener('click', backward);
    };

    destroy = function () {

    };

    init();
  };
}());
