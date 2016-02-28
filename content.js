var readMores = document.querySelectorAll("span.read-more-link-wrapper a");
Array.prototype.forEach.call(readMores, function(el, i){
  el.click();
});