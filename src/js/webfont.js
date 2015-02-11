// Google Webfont
WebFontConfig = {
  //google: { families: [ 'Open+Sans:300italic,400italic,600italic,700italic,400,600,300,700:latin' ] }
  //google: { families: [ 'Lato:400,700:latin', 'Merriweather:400,400italic,700,700italic:latin' ] }
  google: { families: [ 'Roboto:400,700,700italic,400italic:latin', 'Roboto+Slab::latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();