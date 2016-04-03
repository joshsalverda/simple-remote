(function (context) {
  'use strict';

  if(!context.SimpleRemote) {
    context.SimpleRemote = {};
  }

  var SimpleRemote = context.SimpleRemote;

  SimpleRemote.input = {
    open: false,
    keyboardInput: document.getElementById('keyboard-input'),
    onKeyPress: function () {
      if(event.keyCode === 13) {
        SimpleRemote.socket.send('Input.SendText', 0, {
          text: SimpleRemote.input.keyboardInput.value
        });
      }
    },
    onInput: function (event) {
      SimpleRemote.socket.send('Input.SendText', 0, {
        text: SimpleRemote.input.keyboardInput.value,
        done: false
      });
    },
    focus: function () {
      SimpleRemote.input.keyboardInput.focus();
    },
    init: function () {
      document.addEventListener('touchend', SimpleRemote.input.focus);
      document.addEventListener('keypress', SimpleRemote.input.onKeyPress);
      SimpleRemote.input.keyboardInput.addEventListener('input', SimpleRemote.input.onInput);
      SimpleRemote.input.focus();
      SimpleRemote.input.open = true;
    },
    destroy: function () {
      document.removeEventListener('touchend', SimpleRemote.input.focus);
      document.removeEventListener('keypress', SimpleRemote.input.onKeyPress);
      SimpleRemote.input.keyboardInput.removeEventListener('input', SimpleRemote.input.onInput);
      SimpleRemote.input.keyboardInput.value = '';
      SimpleRemote.input.keyboardInput.blur();
      SimpleRemote.input.open = false;
    }
  };
}(this));
