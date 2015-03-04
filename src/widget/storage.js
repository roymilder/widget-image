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
      img.style.backgroundImage = "url(" + e.detail[0] + ")";
      RiseVision.Image.ready();
    });

    storage.setAttribute("folder", params.storage.folder);
    storage.setAttribute("fileName", params.storage.fileName);
    storage.setAttribute("companyId", params.storage.companyId);
    storage.go();
  }

  return {
    "init": init
  };
};
