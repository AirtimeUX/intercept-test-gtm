(function () {
  // If not on a touchscreen, detect exit intent based on when the mouse leaves the window
  function detectIfMouse() {
    function mouseLeaveListener (e) {
      window.dataLayer && window.dataLayer.push({'event': 'airtime.exit-intent'});
      document.removeEventListener('mouseleave', mouseLeaveListener);
    }

    document.addEventListener('mouseleave', mouseLeaveListener , false); 
  }

  // If on a touchscreen, detect exit intent based on idle time
  function detectIfTouch () {
    var idleTimeLimit = 10000;
    var throttleTimeLimit = 2000;
    var timeout;

    var events = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'scroll', 'click'];

    function addListeners(handler) {
      events.forEach(function (event) { document.addEventListener(event, handler); });
    }

    function removeListeners(handler) {
      events.forEach(function (event) { document.removeEventListener(event, handler); });
    }

    function sendEvent() {
      window.dataLayer && window.dataLayer.push({'event': 'airtime.exit-intent'})
      removeListeners(onActivity);
    }

    function startTimer() {
      timeout = setTimeout(sendEvent, idleTimeLimit);
      addListeners(onActivity);
    }

    function onActivity() {
      if (timeout) clearTimeout(timeout);
      removeListeners(onActivity);
      setTimeout(startTimer, throttleTimeLimit);
    }

    startTimer();
  }

  var hasTouchscreen = 'ontouchstart' in window;
  return hasTouchscreen ? detectIfTouch() : detectIfMouse();
})();
