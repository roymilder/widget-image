/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Image = {};

RiseVision.Image = (function (gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    img = document.getElementById("image"),
    message = null,
    params = null,
    fileUrl = null,
    separator = "",
    refreshInterval = 300000;  // 5 minutes

  /*
   *  Private Methods
   */
  function init() {
    var storage = null,
      str;

    img.className = params.position;
    img.className = params.scaleToFit ? img.className + " scale-to-fit" : img.className;
    document.body.style.background = params.background.color;

    // Third party URL
    if (Object.keys(params.storage).length === 0) {
      str = params.url.split("?");

      if (str.length === 1) {
        separator = "?";
      }
      else {
        separator = "&";
      }

      setBackgroundImage();
      ready();
    }
    // Rise Storage
    else {
      // create instance of message
      message = new RiseVision.Common.Message(document.getElementById("container"),
        document.getElementById("messageContainer"));

      // show wait message while Storage initializes
      message.show("Please wait while your image is downloaded.");

      storage = new RiseVision.Image.Storage(params);
      storage.init();

      ready();
    }
  }

  function noStorageFile() {
    message.show("The selected image does not exist.");
  }

  function startTimer() {
    setTimeout(function() {
      setBackgroundImage();
    }, refreshInterval);
  }

  function setBackgroundImage() {
    fileUrl = params.url + separator + "cb=" + new Date().getTime();
    img.style.backgroundImage = "url(" + fileUrl + ")";

    startTimer();
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
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      false, false, true, false);
  }

  function play() {
    RiseVision.Common.LoggerUtils.logEvent(getTableName(), { "event": "play", "file_url": fileUrl });
  }

  function storageFileUpdate(url) {
    fileUrl = url;

    // remove a message previously shown
    message.hide();
  }

  function getTableName() {
    return "image_events";
  }

  return {
    "getAdditionalParams": getAdditionalParams,
    "getTableName": getTableName,
    "noStorageFile": noStorageFile,
    "play": play,
    "storageFileUpdate": storageFileUpdate
  };
})(gadgets);
