(function(window) {
  "use strict";

  window.gadget = window.gadget || {};
  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      "url": "",
      "selector": {
        "selection": "single-folder",
        "storageName": "images/",
        "url": "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o?prefix=images%2F"
      },
      "storage": {
        "companyId": "b428b4e8-c8b9-41d5-8a10-b4193c789443",
        "folder": "images/",
        "fileName": ""
      },
      "resume": true,
      "scaleToFit": true,
      "position": "top-left",
      "duration": 1,
      "pause": 10,
      "autoHide": false
    }
  };
})(window);
