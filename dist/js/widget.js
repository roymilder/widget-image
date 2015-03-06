if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "components/rv-common-i18n/dist/locales/translation_")
    .constant("LOCALES_SUFIX", ".json");

  angular.module("risevision.widget.common.storage-selector.config")
    .value("STORAGE_MODAL", "https://storage-stage.risevision.com/rva-test/dist/storage-modal.html#/files/");
}

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

/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  gadgets.rpc.register("rsparam_set_" + id, RiseVision.Image.getAdditionalParams);
  gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
})(window, document, gadgets);

/* jshint ignore:start */
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-57092159-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/* jshint ignore:end */
