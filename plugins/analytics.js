/* eslint-disable  */
export default ({ app }) => {
  /*
    ** Only run on client-side and only in production mode
    */
  if (process.env.NODE_ENV !== 'production') { return; }
  // Segment
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.13.1";
  analytics.load("tFxDsGlTB1fMCmTrpejuqVstBWO1IqvG");
  analytics.page();
  }}();

  /*
    * Include Google Analytics Script
  */
  (function (i, s, o, g, r, a, m) {
    // eslint-disable-next-line dot-notation
    i['GoogleAnalyticsObject'] = r;
    // eslint-disable-next-line no-unused-expressions
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1;
    a.src = g; m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /*
    ** Set the current page
    */

  ga('create', 'UA-173372582-2', 'auto');
  /*
    ** Every time the route changes (fired on initialization too)
    */
  app.router.afterEach((to /* from */) => {
    /*
      ** We tell Google Analytics to add a `pageview`
      */
    ga('set', 'page', to.fullPath);
    ga('send', 'pageview');

  });
};
/* eslint-enable */
