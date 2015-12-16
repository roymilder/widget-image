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
      img = document.getElementById("image"),
      table = RiseVision.Image.getTableName(),
      url = "";

    storage.addEventListener("rise-storage-response", function(e) {
      if (e.detail && e.detail.url) {
        // Escape single quotes.
        url = e.detail.url.replace("'", "\\'");
        img.style.backgroundImage = "url('" + url + "')";

        RiseVision.Image.storageFileUpdate(url);
      }
    });

    storage.addEventListener("rise-storage-no-file", function(e) {
      var params = {
        "event": "error",
        "event_details": "storage file not found",
        "file_url": e.detail
      };

      // clear the existing image
      img.style.background = "";

      RiseVision.Common.LoggerUtils.logEvent(table, params);
      RiseVision.Image.noStorageFile();
    });

    storage.addEventListener("rise-storage-file-throttled", function(e) {
      var params = {
        "event": "error",
        "event_details": "storage file throttled",
        "file_url": e.detail
      };

      RiseVision.Common.LoggerUtils.logEvent(table, params);
    });

    storage.addEventListener("rise-storage-error", function(e) {
      var fileUrl = (e.detail && e.detail.request && e.detail.request.url) ? e.detail.request.url : null,
        params = {
          "event": "error",
          "event_details": "rise storage error",
          "file_url": fileUrl
        };

      RiseVision.Common.LoggerUtils.logEvent(table, params);
    });

    storage.addEventListener("rise-cache-error", function(e) {
      var fileUrl = (e.detail && e.detail.request && e.detail.request.url) ? e.detail.request.url : null,
        params = {
          "event": "error",
          "event_details": "rise cache error",
          "file_url": fileUrl
        };

      RiseVision.Common.LoggerUtils.logEvent(table, params);
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
