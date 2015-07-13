var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-url-e2e.html";

casper.options.waitTimeout = 300000;

casper.on("remote.message", function(msg) {
  this.echo(msg);
});

casper.test.begin("Image Widget - URL - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Widget", "Test page has loaded");

      casper.evaluate(function() {
        //window.clock = sinon.useFakeTimers();
      });
    });

    casper.then(function () {
      casper.evaluate(function () {
        var evt = document.createEvent("CustomEvent");

        evt.initCustomEvent("WebComponentsReady", false, false);
        window.dispatchEvent(evt);
      });

      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadImage() {
          return document.getElementById("image").classList.contains("scale-to-fit");
        });
      },
      function then() {
        var imageBefore = "";

        test.assertExists(".scale-to-fit", "Scale to fit");
        test.assertExists(".middle-center", "Alignment");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: rgb(204, 204, 204); " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");
        test.assertMatch(this.getElementAttribute("#image", "style"),
          /^background-image: url\(http:\/\/s3.amazonaws.com\/rise-common\/images\/logo-small.png\?cb=[0-9]+\);/, "Image");

        imageBefore = this.evaluate(function getImageBefore() {
          window.imageBefore = document.getElementById("image").getAttribute("style");

          return window.imageBefore;
        });

        // Image Refresh
        casper.evaluate(function() {
          //window.clock.tick(300000);
        });

        casper.waitFor(function waitForTimer() {
          return this.evaluate(function expireTimer() {
            return document.getElementById("image").getAttribute("style") !== window.imageBefore;
          });
        },
        function then() {
          this.evaluate(function() {
            //window.clock.restore();
          });

          test.assertNotEquals(this.getElementAttribute("#image", "style"), imageBefore, "Image refreshed");
        });
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
