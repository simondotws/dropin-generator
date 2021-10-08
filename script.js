//Insert the GoCardless Dropin Script
document.write('<script src="https://pay.gocardless.com/billing/static/dropin/v2/initialise.js"></script>');

var gocardlessHandler = function() {
  const url = this.getAttribute('data-url');
  const reqUrl = 'https://dropin-generator.herokuapp.com/get?paylink_url=' + url;
  const env = this.getAttribute('data-environment');

  if(isValidHttpUrl(this.getAttribute('data-url')) === false){
    throw new Error("URL is not properly configured");
  }

  if (!env.includes("sandbox","production")) {
    throw new Error("Environment not set properly. Value must be \'sandbox\' or \'production\'.");
  }

  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', reqUrl, true);
  req.onload  = function() {

     const handler = GoCardlessDropin.create({
       billingRequestFlowID: req.response.brf_id,
       environment: env,

       onSuccess: (billingRequest, billingRequestFlow) => {
         console.log(billingRequest);
         console.log(billingRequestFlow);
       },

       onExit: (error, metadata) => {
         console.error(error);
         console.error(metadata);
       },
     });
     handler.open();

  };
  req.send(null);
};

//Set up button click handler
document.addEventListener("DOMContentLoaded", function() {
  document
    .getElementById("gocardless-btn")
    .addEventListener("click", gocardlessHandler);
});

//Functions
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
