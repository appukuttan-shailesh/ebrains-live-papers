var head = document.getElementsByTagName('head')[0];
var ga_script_g = document.createElement('SCRIPT');
var ga_script = document.createElement('SCRIPT');
ga_script_g.async = true;
ga_script.type = 'text/javascript';

var url = window.location.href;

if (url.includes("https://humanbrainproject.github.io/hbp-bsp-live-papers/") ||
    url.includes("https://collab.humanbrainproject.eu")){
	console.log("Loading ga for epfl")
    ga_script_g.src = 'https://www.googletagmanager.com/gtag/js?id=UA-91794319-5';
    ga_script.src = 'https://humanbrainproject.github.io/hbp-bsp-live-papers/static/js/lp_prod_analytics.js';
} else if (url.includes("https://cnr-ibf-pa.github.io/hbp-bsp-live-papers-dev/")){
	console.log("Loading ga for bspg")
    ga_script_g.src = 'https://www.googletagmanager.com/gtag/js?id=UA-91794319-4';
    ga_script.src = 'https://cnr-ibf-pa.github.io/hbp-bsp-live-papers-dev/static/js/lp_dev_analytics.js';
} else {
    console.log("Loading locally or from an unknown domain");
} 

head.prepend(ga_script);
head.prepend(ga_script_g);
