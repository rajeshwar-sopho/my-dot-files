try {

  console.log("This bg.js script!")

  // -----------------------------------------------------------
  // Google
  // var _gaq = _gaq || [];
  // _gaq.push(['_setAccount', 'UA-52054709-1']);
  // _gaq.push(['_trackPageview']);
  // (function () {
  //   console.log("Google Analytics Setupt - 2")
  //   var ga = document.createElement('script');
  //   ga.type = 'text/javascript';
  //   ga.async = true;
  //   ga.src = 'https://ssl.google-analytics.com/ga.js';
  //   var s = document.getElementsByTagName('script')[0];
  //   s.parentNode.insertBefore(ga, s);
  // })();

  function cEvent(path, type) {
    // _gaq.push(['_trackEvent', path, type]);
  }

  // chrome.extension.onRequest.addListener(
  //     function (request, sender, sendResponse) {
  //       cEvent(request.message, request.type);
  //     }
  // );

  chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        cEvent(request.message, request.type);
        // Optionally, send a response back to the sender
        sendResponse({status: "received"});
      }
  );

} catch (e) {
  console.error("Error in bg.js");
  console.error(e);
}

