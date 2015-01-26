angular.module("risevision.widget.image.settings")
  .controller("imageSettingsController", ["$scope", "$q", "$log", "commonSettings", "imageValidator",
    function ($scope, $q, $log, commonSettings, imageValidator) {
      var imageUrl = "";

      $scope.isValidUrl = false;
      $scope.isValidFileType = true;

      $scope.validateImage = function() {
        if ($scope.settingsForm.urlField.$valid && imageUrl !== "") {
          imageValidator.isImage(imageUrl).then(function(result) {
            $scope.isValidFileType = result;

            if (result) {
              $scope.settings.additionalParams.storage = commonSettings.getStorageUrlData(imageUrl);
              $scope.$parent.saveSettings();
            }
            else {
              $scope.settings.additionalParams.storage = {};
            }
          });
        }
      };

      var urlWatcher = $scope.$watch("settings.additionalParams.url", function (newUrl, oldUrl) {
        if (typeof newUrl !== "undefined") {
          if (typeof oldUrl === "undefined" && newUrl === "") {
            // Force URL field component to be invalid when empty.
            $scope.settingsForm.$setValidity("urlField", false);
          }
          else if (newUrl !== "") {
            // Destroy the watcher.
            urlWatcher();
          }
        }
      });

      $scope.$watch("settings.additionalParams.url", function (url) {
        if (url !== undefined && url !== "") {
          imageUrl = url;

          if ($scope.settingsForm.urlField.$valid) {
            $scope.isValidUrl = true;
            $scope.settingsForm.$setValidity("urlField", $scope.isValidUrl);
          }
          else {
            $scope.isValidUrl = false;
            $scope.settingsForm.$setValidity("urlField", $scope.isValidUrl);
          }
        }
      });
    }])
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "url": "",
      "storage": {},
      "scaleToFit": true,
      "position": "top-left",
      "background": {}
    }
  });
