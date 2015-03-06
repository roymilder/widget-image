/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Image = {};

RiseVision.Image = (function (gadgets) {
  "use strict";

  var params,
    prefs = new gadgets.Prefs(),
    img = document.getElementById("image"),
    separator = "",
    refreshInterval = 900000;  // 15 minutes

  /*
   *  Private Methods
   */
  function init() {
    var storage = null,
      str;

    img.className = params.position;
    img.className = params.scaleToFit ? img.className + " scale-to-fit" : img.className;
    document.body.style.background = params.background.color;

    if (Object.keys(params.storage).length === 0) {
      str = params.url.split("?");

      if (str.length === 1) {
        separator = "?";
      }
      else {
        separator = "&";
      }

      img.style.backgroundImage = "url(" + params.url + ")";
      startTimer();
      ready();
    }
    // Rise Storage
    else {
      storage = new RiseVision.Image.Storage(params);
      storage.init();
    }
  }

  function startTimer() {
    setTimeout(function() {
      img.style.backgroundImage = "url(" + params.url + separator + "cb=" + new Date().getTime() + ")";
      startTimer();
    }, refreshInterval);
  }

  /*
   *  Public Methods
   */
  function getAdditionalParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        document.getElementById("container").style.height = prefs.getInt("rsH") + "px";
        init();
      }
    }
  }

  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), false,
      false, false, true, false);
  }

  return {
    "ready": ready,
    "getAdditionalParams": getAdditionalParams
  };
})(gadgets);
