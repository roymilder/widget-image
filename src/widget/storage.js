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
      if (e.detail && e.detail.files && e.detail.files.length > 0) {
        img.style.backgroundImage = "url(" + e.detail.files[0].url + ")";
      }

      if (isLoading) {
        RiseVision.Image.ready();
        isLoading = false;
      }
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
