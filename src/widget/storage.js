/* global config */
var RiseVision = RiseVision || {};
RiseVision.Image = RiseVision.Image || {};

RiseVision.Image.Storage = function (params) {
  "use strict";

  /*
   *  Public Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage"),
      img = document.getElementById("image");

    storage.addEventListener("rise-storage-response", function(e) {
      if (e.detail && e.detail.url) {
        // Escape single quotes.
        img.style.backgroundImage = "url('" + e.detail.url.replace("'", "\\'") + "')";

        RiseVision.Image.storageFileUpdate();
      }
    });

    storage.addEventListener("rise-storage-no-file", function() {
      // clear the existing image
      img.style.background = "";

      RiseVision.Image.noStorageFile();
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
