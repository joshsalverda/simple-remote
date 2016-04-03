(function (context) {
  'use strict';

  if(!context.SimpleRemote) {
    context.SimpleRemote = {};
  }

  var SimpleRemote = context.SimpleRemote,
      progressiveTimeout,
      progressiveTimer = 300,
      progressiveSpeed = 1,
      tempSpeed = progressiveSpeed,
      getUpdatedTimer = function () {
        var timer = tempSpeed * progressiveTimer;
        tempSpeed -= .2;

        if(timer <= 0) {
          timer = 0;
        }

        return timer;
      },
      progressiveIncrement = function (recursive, callback) {
        progressiveTimeout = setTimeout(function () {
          callback();
          progressiveTimeout = setTimeout(recursive, getUpdatedTimer());
        }, progressiveTimer);
      },
      panUp = function () {
        progressiveIncrement(panUp, function () {
          SimpleRemote.socket.send('Input.Up');
        });
      },
      panDown = function () {
        progressiveIncrement(panDown, function () {
          SimpleRemote.socket.send('Input.Down');
        });
      },
      panLeft = function () {
        tempSpeed = 10;
        progressiveIncrement(panLeft, function () {
          var activePlayer = SimpleRemote.getActivePlayer();
          if(activePlayer && activePlayer.speed() > -32) {
            activePlayer.decrementSpeed();
          }
        });
      },
      panRight = function () {
        tempSpeed = 10;
        progressiveIncrement(panRight, function () {
          var activePlayer = SimpleRemote.getActivePlayer();
          if(activePlayer && activePlayer.speed() < 32) {
            activePlayer.incrementSpeed();
          }
        });
      };

  SimpleRemote.hammer = {
    onSwipe: function (event) {
      var activePlayer = SimpleRemote.getActivePlayer();

      switch(event.type) {
        case 'swipedown':
          this.socket.send('Input.Down');
        break;

        case 'swipeup':
          this.socket.send('Input.Up');
        break;

        case 'swipeleft':
          if(activePlayer && (activePlayer.playing() || activePlayer.paused())) {
            activePlayer.smallbackward();
          } else {
            this.socket.send('Input.Left');
          }
        break;

        case 'swiperight':
          if(activePlayer && (activePlayer.playing() || activePlayer.paused())) {
            activePlayer.smallforward();
          } else {
            this.socket.send('Input.Right');
          }
        break;
      }
    },
    onTap: function (event) {
      var activePlayer = SimpleRemote.getActivePlayer();

      if(activePlayer && (activePlayer.playing() || activePlayer.paused())) {
        activePlayer.playPause();
      } else {
        if(SimpleRemote.input.open === false) {
          this.socket.send('Input.Select');
        }
      }
    },
    onPress: function (event) {
      var activePlayer = SimpleRemote.getActivePlayer();

      if(activePlayer && (activePlayer.playing() || activePlayer.paused())) {
        activePlayer.stop();
      } else {
        this.socket.send('Input.ContextMenu');
      }
    },
    onPanMove: function (event) {
      var self = this,
          activePlayer = SimpleRemote.getActivePlayer();

      clearTimeout(progressiveTimeout);

      if(activePlayer && (activePlayer.playing() || activePlayer.paused())) {
        if(event.offsetDirection === Hammer.DIRECTION_LEFT) {
          panLeft();
        } else if(event.offsetDirection === Hammer.DIRECTION_RIGHT) {
          panRight();
        }
      } else {
        if(event.offsetDirection === Hammer.DIRECTION_UP) {
          panUp();
        } else if(event.offsetDirection === Hammer.DIRECTION_DOWN) {
          panDown();
        }
      }
    },
    onPanEnd: function () {
      var activePlayer = SimpleRemote.getActivePlayer();

      clearTimeout(progressiveTimeout);
      tempSpeed = progressiveSpeed;

      if(activePlayer && activePlayer.playing()) {
        activePlayer.setSpeed(1);
      }
    },
    onPinchEnd: function (event) {
      if(event.additionalEvent === 'pinchout') {
        this.socket.send('Input.Back');
      }
    },
    bind: function () {
      this.hammer.on('swipeleft swiperight swipeup swipedown', this.onSwipe.bind(this));
      this.hammer.on('tap', this.onTap.bind(this));
      this.hammer.on('press', this.onPress.bind(this));
      this.hammer.on('panmove', this.onPanMove.bind(this));
      this.hammer.on('panend', this.onPanEnd.bind(this));
      this.hammer.on('pinchend', this.onPinchEnd.bind(this));
    },
    init: function (selector) {
      this.hammer = new Hammer(selector);

      this.hammer.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        velocity: 0.5
      });

      this.hammer.get('pan').set({
        threshold: 50
      });

      this.hammer.get('tap').set({
        threshold: 10
      });

      this.hammer.get('press').set({
        time: 500
      });

      this.hammer.get('pinch').set({
        enable: true
      });

      this.socket = SimpleRemote.socket;

      this.bind();
    },
    destroy: function () {
      this.hammer.off('swipeleft swiperight swipeup swipedown tap press panmove panend pinchend');
    }
  };
}(this));
