var RiseVision = RiseVision || {};
RiseVision.Image = RiseVision.Image || {};

RiseVision.Image.Storage = function (params) {
  "use strict";

  var companyId = "";

  /*
   *  Private Methods
   */
  function initStorage() {
    var storage = document.querySelector("rise-storage"),
      img = document.getElementById("image");

    storage.addEventListener("rise-storage-response", function(e) {
      img.style.backgroundImage = "url(" + e.detail[0] + ")";
      RiseVision.Image.ready();
    });

    storage.setAttribute("folder", params.storage.folder);
    storage.setAttribute("fileName", params.storage.fileName);
    storage.setAttribute("companyId", companyId);
    storage.go();
  }

  /*
   *  Public Methods
   */
  function getCompanyId(name, value) {
    if (name === "companyId") {
      companyId = value;
      initStorage();
    }
  }

  return {
    "getCompanyId": getCompanyId
  };
};
