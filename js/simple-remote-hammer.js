(function () {
  'use strict';

  window.SimpleRemote = window.SimpleRemote || {};

  window.SimpleRemote.hammer = {
    onSwipe: function (event) {
      switch(event.type) {
        case 'swipedown':
          this.socket.send('Input.Down');
        break;

        case 'swipeup':
          this.socket.send('Input.Up');
        break;

        case 'swipeleft':
            this.socket.send('Input.Left');
        break;

        case 'swiperight':
            this.socket.send('Input.Right');
        break;
      }
    },
    onTap: function () {
      this.socket.send('Input.Select');
    },
    onPress: function () {
      this.socket.send('Input.ContextMenu');
    },
    bind: function () {
      this.hammer.on('swipeleft swiperight swipeup swipedown', this.onSwipe.bind(this));
      this.hammer.on('tap', this.onTap.bind(this));
      this.hammer.on('press', this.onPress.bind(this));
    },
    init: function (selector) {
      this.hammer = new Hammer(selector);

      this.hammer.get('swipe').set({
          direction: Hammer.DIRECTION_ALL,
          velocity: 0.5
      });

      this.hammer.get('pan').set({
          direction: Hammer.DIRECTION_VERTICAL,
          threshold: 50
      });

      this.hammer.get('tap').set({
          threshold: 10
      });

      this.socket = SimpleRemote.socket;

      this.bind();
    },
    destroy: function () {
      /* TODO re-implement
      this.hammer.off('swipeleft swiperight swipeup swipedown', this.onSwipe);
      this.hammer.off('tap', onTap);
      this.hammer.off('press', onPress);
      this.hammer = null;
      this.socket = null;*/
    }
  };
}());







/*
hammer.on('panend', function () {
    clearInterval(panningInterval);
    hammer.off('hammer.input');
});

hammer.on('panmove', function (event) {
    //if(currentPanDirection && event.direction !== currentPanDirection) {
      //  if(event.distance >
    //}
    clearInterval(panningInterval);

    currentPanDirection = event.direction;

    console.log(event);

    if(currentPanDirection === hammer.DIRECTION_UP) {
        panningInterval = setInterval(function () {
            ws.send('{"jsonrpc": "2.0", "method": "Input.Up"}');
        }, 500);
    } else {
        panningInterval = setInterval(function () {
            ws.send('{"jsonrpc": "2.0", "method": "Input.Down"}');
        }, 500);
    }
});

hammer.on('panup', function (event) {
    currentPanDirection = hammer.DIRECTION_UP;

    clearInterval(panningInterval);
    panningInterval = setInterval(function () {
        ws.send('{"jsonrpc": "2.0", "method": "Input.Up"}');
    }, 500);
});

hammer.on('pandown', function () {
    currentPanDirection = hammer.DIRECTION_DOWN;

    clearInterval(panningInterval);
    panningInterval = setInterval(function () {
        ws.send('{"jsonrpc": "2.0", "method": "Input.Down"}');
    }, 500);
});
*/
