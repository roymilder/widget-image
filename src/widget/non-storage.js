var RiseVision = RiseVision || {};
RiseVision.Image = RiseVision.Image || {};

RiseVision.Image.NonStorage = function (data) {
  "use strict";

  var riseCache = RiseVision.Common.RiseCache;

  var _refreshDuration = 300000,  // 5 minutes
    _refreshIntervalId = null;

  var _isLoading = true;

  var _url = "";

  function _getFile(omitCacheBuster) {
    var params;

    riseCache.getFile(_url, function (response, error) {
      if (!error) {

        if (_isLoading) {
          _isLoading = false;

          RiseVision.Image.onFileInit(response.url);

          // start the refresh interval
          _startRefreshInterval();

        } else {
          RiseVision.Image.onFileRefresh(response.url);
        }

      } else {

        // error occurred
        params = {
          "event": "error",
          "event_details": "non-storage error",
          "error_details": error.message,
          "file_url": response.url
        };

        RiseVision.Image.logEvent(params, true);
        RiseVision.Image.showError("There was a problem retrieving the file from Rise Cache.");
      }
    }, omitCacheBuster);
  }

  function _startRefreshInterval() {
    if (_refreshIntervalId === null) {
      _refreshIntervalId = setInterval(function () {
        _getFile(false);
      }, _refreshDuration);
    }
  }

  /*
   *  Public Methods
   */
  function init() {
    // Handle pre-merge use of "url" setting property
    _url = (data.url && data.url !== "") ? data.url : data.selector.url;

    _getFile(true);
  }

  return {
    "init": init
  };
};
