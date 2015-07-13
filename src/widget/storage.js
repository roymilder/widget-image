/* global config */
var RiseVision = RiseVision || {};
RiseVision.Image = RiseVision.Image || {};

RiseVision.Image.Storage = function (params) {
  "use strict";

  var isLoading = true;

  /*
   *  Public Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage"),
      img = document.getElementById("image");

    storage.addEventListener("rise-storage-response", function(e) {
      if (isLoading) {
        if (e.detail && e.detail.url) {
          img.style.backgroundImage = "url(" + e.detail.url + ")";
        }

        RiseVision.Image.ready();
        isLoading = false;
      }
      else {
        if (e.detail && e.detail.url) {
          // Image has been changed.
          if (e.detail.hasOwnProperty("changed") && e.detail.changed) {
            img.style.backgroundImage = "url(" + e.detail.url + ")";
          }
        }
      }
    });

    storage.setAttribute("folder", params.storage.folder);
    storage.setAttribute("fileName", params.storage.fileName);
    storage.setAttribute("companyId", params.storage.companyId);
    storage.setAttribute("env", config.STORAGE_ENV);
    storage.go();
  }

  return {
    "init": init
  };
};
