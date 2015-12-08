/* global config: true */
/* exported config */
if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}

if (typeof config === "undefined") {
  var config = {
    STORAGE_ENV: "prod"
  };
}

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
    separator = "?",
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

var WIDGET_COMMON_CONFIG = {
  AUTH_PATH_URL: "v1/widget/auth",
  LOGGER_CLIENT_ID: "1088527147109-6q1o2vtihn34292pjt4ckhmhck0rk0o7.apps.googleusercontent.com",
  LOGGER_CLIENT_SECRET: "nlZyrcPLg6oEwO9f9Wfn29Wh",
  LOGGER_REFRESH_TOKEN: "1/xzt4kwzE1H7W9VnKB8cAaCx6zb4Es4nKEoqaYHdTD15IgOrJDtdun6zK6XiATCKT",
  STORAGE_ENV: "prod",
  STORE_URL: "https://store-dot-rvaserver2.appspot.com/"
};
var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Message = function (mainContainer, messageContainer) {
  "use strict";

  var _active = false;

  function _init() {
    try {
      messageContainer.style.height = mainContainer.style.height;
    } catch (e) {
      console.warn("Can't initialize Message - ", e.message);
    }
  }

  /*
   *  Public Methods
   */
  function hide() {
    if (_active) {
      // clear content of message container
      while (messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
      }

      // hide message container
      messageContainer.style.display = "none";

      // show main container
      mainContainer.style.visibility = "visible";

      _active = false;
    }
  }

  function show(message) {
    var fragment = document.createDocumentFragment(),
      p;

    if (!_active) {
      // hide main container
      mainContainer.style.visibility = "hidden";

      messageContainer.style.display = "block";

      // create message element
      p = document.createElement("p");
      p.innerHTML = message;
      p.setAttribute("class", "message");

      fragment.appendChild(p);
      messageContainer.appendChild(fragment);

      _active = true;
    } else {
      // message already being shown, update message text
      p = messageContainer.querySelector(".message");
      p.innerHTML = message;
    }
  }

  _init();

  return {
    "hide": hide,
    "show": show
  };
};

/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.LoggerUtils = (function(gadgets) {
  "use strict";

   var id = new gadgets.Prefs().getString("id"),
    displayId = "",
    companyId = "",
    callback = null;

  var BASE_INSERT_SCHEMA =
  {
    "kind": "bigquery#tableDataInsertAllRequest",
    "skipInvalidRows": false,
    "ignoreUnknownValues": false,
    "rows": [{
      "insertId": ""
    }]
  };

  /*
   *  Private Methods
   */

  /* Set the Company and Display IDs. */
  function setIds(names, values) {
    if (Array.isArray(names) && names.length > 0) {
      if (Array.isArray(values) && values.length > 0) {
        if (names[0] === "companyId") {
          companyId = values[0];
        }

        if (names[1] === "displayId") {
          if (values[1]) {
            displayId = values[1];
          }
          else {
            displayId = "preview";
          }
        }

        callback(companyId, displayId);
      }
    }
  }

  /* Retrieve parameters to pass to the event logger. */
  function getEventParams(params, cb) {
    var json = null;

    // event is required.
    if (params.event) {
      json = {};
      json.event = params.event;

      if (params.event_details) {
        json.event_details = params.event_details;
      }

      if (params.file_url) {
        json.file_url = params.file_url;
        json.file_format = getFileFormat(params.file_url);
      }

      getIds(function(companyId, displayId) {
        json.company_id = companyId;
        json.display_id = displayId;

        cb(json);
      });
    }
    else {
      cb(json);
    }
  }

  /*
   *  Public Methods
   */
  function getIds(cb) {
    if (!cb || typeof cb !== "function") {
      return;
    }
    else {
      callback = cb;
    }

    if (companyId && displayId) {
      callback(companyId, displayId);
    }
    else {
      if (id && id !== "") {
        gadgets.rpc.register("rsparam_set_" + id, setIds);
        gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId"]);
      }
    }
  }

  function getFileFormat(url) {
    var hasParams = /[?#&]/,
      str;

    if (!url || typeof url !== "string") {
      return null;
    }

    str = url.substr(url.lastIndexOf(".") + 1);

    // don't include any params after the filename
    if (hasParams.test(str)) {
      str = str.substr(0 ,(str.indexOf("?") !== -1) ? str.indexOf("?") : str.length);

      str = str.substr(0, (str.indexOf("#") !== -1) ? str.indexOf("#") : str.length);

      str = str.substr(0, (str.indexOf("&") !== -1) ? str.indexOf("&") : str.length);
    }

    return str.toLowerCase();
  }

  function getInsertData(params) {
    var data = JSON.parse(JSON.stringify(BASE_INSERT_SCHEMA));

    data.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
    data.rows[0].json = JSON.parse(JSON.stringify(params));
    data.rows[0].json.ts = new Date().toISOString();

    return data;
  }

  function getTable(name) {
    var date = new Date(),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1,
      day = date.getUTCDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return name + year + month + day;
  }

  function logEvent(table, params) {
    getEventParams(params, function(json) {
      if (json !== null) {
        RiseVision.Common.Logger.log(table, json);
      }
    });
  }

  return {
    "getIds": getIds,
    "getInsertData": getInsertData,
    "getFileFormat": getFileFormat,
    "getTable": getTable,
    "logEvent": logEvent
  };
})(gadgets);

RiseVision.Common.Logger = (function(utils) {
  "use strict";

  var REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_ID +
      "&client_secret=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_SECRET +
      "&refresh_token=" + WIDGET_COMMON_CONFIG.LOGGER_REFRESH_TOKEN +
      "&grant_type=refresh_token";

  var serviceUrl = "https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/TABLE_ID/insertAll",
    throttle = false,
    throttleDelay = 1000,
    lastEvent = "",
    refreshDate = 0,
    token = "";

  /*
   *  Private Methods
   */
  function refreshToken(cb) {
    var xhr = new XMLHttpRequest();

    if (new Date() - refreshDate < 3580000) {
      return cb({});
    }

    xhr.open("POST", REFRESH_URL, true);
    xhr.onloadend = function() {
      var resp = JSON.parse(xhr.response);

      cb({ token: resp.access_token, refreshedAt: new Date() });
    };

    xhr.send();
  }

  function isThrottled(event) {
    return throttle && (lastEvent === event);
  }

  /*
   *  Public Methods
   */
  function log(tableName, params) {
    if (!tableName || !params || (params.hasOwnProperty("event") && !params.event) ||
      (params.hasOwnProperty("event") && isThrottled(params.event))) {
      return;
    }

    throttle = true;
    lastEvent = params.event;

    setTimeout(function () {
      throttle = false;
    }, throttleDelay);

    function insertWithToken(refreshData) {
      var xhr = new XMLHttpRequest(),
        insertData, url;

      url = serviceUrl.replace("TABLE_ID", utils.getTable(tableName));
      refreshDate = refreshData.refreshedAt || refreshDate;
      token = refreshData.token || token;
      insertData = utils.getInsertData(params);

      // Insert the data.
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);

      if (params.cb && typeof params.cb === "function") {
        xhr.onloadend = function() {
          params.cb(xhr.response);
        };
      }

      xhr.send(JSON.stringify(insertData));
    }

    return refreshToken(insertWithToken);
  }

  return {
    "log": log
  };
})(RiseVision.Common.LoggerUtils);

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
          "event_details": "storage error",
          "file_url": fileUrl
        };

      RiseVision.Common.LoggerUtils.logEvent(table, params);
    });

    storage.addEventListener("rise-cache-error", function(e) {
      var fileUrl = (e.detail && e.detail.request && e.detail.request.url) ? e.detail.request.url : null,
        params = {
          "event": "error",
          "event_details": "cache error",
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

  window.addEventListener("WebComponentsReady", function() {
    if (id && id !== "") {
      gadgets.rpc.register("rscmd_play_" + id, play);
      gadgets.rpc.register("rsparam_set_" + id, RiseVision.Image.getAdditionalParams);
      gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
    }
  });

  function play() {
    RiseVision.Image.play();
  }
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
