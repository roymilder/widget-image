angular.module("risevision.widget.image.settings")
  .controller("imageSettingsController", ["$scope", "$q", "$log", "commonSettings", "imageValidator",
    function ($scope, $q, $log, commonSettings, imageValidator) {
      var imageUrl = "";

      $scope.isValidImage = true;

      $scope.validateImage = function() {
        if ($scope.settingsForm.urlField.$valid && imageUrl !== "") {
          imageValidator.isImage(imageUrl).then(function(result) {
            $scope.isValidImage = result;

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

      $scope.$watch("settings.additionalParams.url", function (url) {
        if (url !== undefined && url !== "") {
          imageUrl = url;
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
