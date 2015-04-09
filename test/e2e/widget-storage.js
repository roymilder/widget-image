var require = patchRequire(require);
var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-storage-e2e.html";

casper.on("remote.message", function(msg) {
  this.echo(msg);
})

casper.test.begin("Image Widget - Storage - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Widget", "Test page has loaded");
    });

    casper.then(function () {
      casper.evaluate(function (){
        var evt = document.createEvent("CustomEvent");

        evt.initCustomEvent("polymer-ready", false, false);
        window.dispatchEvent(evt);
      });

      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadImage() {
          return document.getElementById("image").classList.contains("top-left");
        });
      },
      function then() {
        var imageStyle = "";

        test.assertDoesntExist(".scale-to-fit", "No scale to fit");
        test.assertExists(".top-left", "Alignment");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: transparent; " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");
        test.assertEval(function() {
          return document.getElementById("image").getAttribute("style") ===
              "background-image: url(https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fmoon.jpg?alt=media); ";
        }, "Image");

        // Image Refresh
        imageStyle = this.evaluate(function getImageStyle() {
          window.imageStyle = document.getElementById("image").getAttribute("style");

          return window.imageStyle;
        });

        casper.waitFor(function refreshImage() {
          return this.evaluate(function getNewImageStyle() {
            return document.getElementById("image").getAttribute("style") !== window.imageStyle;
          });
        },
        function then() {
          test.assertNotEquals(this.getElementAttribute("#image", "style"), imageStyle, "Image refreshed");
        });
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
