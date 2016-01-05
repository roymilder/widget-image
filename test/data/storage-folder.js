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
        "url": "https://www.googleapis.com/storage/v1/b/risemedialibrary-abc123/o?prefix=images%2F"
      },
      "storage": {
        "companyId": "abc123",
        "folder": "images/",
        "fileName": ""
      },
      "scaleToFit": true,
      "position": "top-left",
      "duration": 1,
      "pause": 10,
      "autoHide": false
    }
  };
})(window);
