(function (context) {
  'use strict';

  if(!context.SimpleRemote) {
    context.SimpleRemote = {};
  }

  var SimpleRemote = context.SimpleRemote,
      hintInterval,
      hintIndex = 0,
      actionHints = document.querySelectorAll('.action-hints > div'),
      hintsWrap = document.querySelector('.action-hints-wrap'),
      help = document.querySelector('.help'),
      skipHint = function (event) {
        event.stopPropagation();

        if(hintInterval) {
          clearInterval(hintInterval);
          displayHint();
          hintInterval = setInterval(displayHint, 10000);
        }
      },
      displayHint = function () {
        if(hintIndex > 0) {
          actionHints[hintIndex - 1].classList.remove('show');
        }

        if(hintIndex >= actionHints.length) {
          clearInterval(hintInterval);
          hintsWrap.classList.remove('show');
        } else {
          actionHints[hintIndex].classList.add('show');
          hintIndex++;
        }
      },
      displayHints = function (event) {
        hintsWrap.classList.add('show');
        event.stopPropagation();
        clearInterval(hintInterval);
        hintIndex = 0;
        displayHint();
        hintInterval = setInterval(displayHint, 10000);
      };

  SimpleRemote.help = {
    init: function () {
      hintsWrap.addEventListener('click', skipHint);
      help.addEventListener('click', displayHints);
    },
    destroy: function () {
      hintsWrap.removeEventListener('click', skipHint);
      help.removeEventListener('click', displayHints);
    }
  };
}(this));
