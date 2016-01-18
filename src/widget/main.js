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

  function configure(names, values) {
    var additionalParams, mode,
      companyId = "",
      displayId = "";

    if (Array.isArray(names) && names.length > 0 && Array.isArray(values) && values.length > 0) {
      // company id
      if (names[0] === "companyId") {
        companyId = values[0];
      }

      // display id
      if (names[1] === "displayId") {
        if (values[1]) {
          displayId = values[1];
        }
      else {
          displayId = "preview";
        }
      }

      // provide LoggerUtils the ids to use
      RiseVision.Common.LoggerUtils.setIds(companyId, displayId);

      // additional params
      if (names[2] === "additionalParams") {
        additionalParams = JSON.parse(values[2]);

        if (Object.keys(additionalParams.storage).length !== 0) {
          // storage file or folder selected
          if (!additionalParams.storage.fileName) {
            // folder was selected
            mode = "folder";
          } else {
            // file was selected
            mode = "file";
          }
        } else {
          // non-storage file was selected
          mode = "file";
        }

        RiseVision.Image.setAdditionalParams(additionalParams, mode);
      }
    }
  }

  function pause() {
    RiseVision.Image.pause();
  }

  function play() {
    RiseVision.Image.play();
  }

  function stop() {
    RiseVision.Image.stop();
  }

  function polymerReady() {
    window.removeEventListener("WebComponentsReady", polymerReady);

    if (id && id !== "") {
      gadgets.rpc.register("rscmd_play_" + id, play);
      gadgets.rpc.register("rscmd_pause_" + id, pause);
      gadgets.rpc.register("rscmd_stop_" + id, stop);
      gadgets.rpc.register("rsparam_set_" + id, configure);
      gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
    }
  }

  window.addEventListener("WebComponentsReady", polymerReady);

})(window, document, gadgets);
