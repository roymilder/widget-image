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
        test.assertDoesntExist(".scale-to-fit", "No scale to fit");
        test.assertExists(".top-left", "Alignment");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: transparent; " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");
        test.assertEquals(this.getElementAttribute("#image", "style"),
          "background-image: url(https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/Widgets%2Fmoon.jpg); ", "Image");

        /* TODO: Test that image is refreshed. */
        // casper.evaluate(function() {
        //   window.clock = sinon.useFakeTimers();
        // });

        // casper.waitFor(function waitForTimer() {
        //   return this.evaluate(function expireTimer() {
        //     window.clock.tick(900000);

        //     return document.getElementById("image").getAttribute("style") !==
        //       "background-image: url(https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/Widgets%2Fmoon.jpg); ";
        //   });
        // },
        // function then() {
        //   this.evaluate(function() {
        //     window.clock.restore();
        //   });

        //   test.assertNotEquals(this.getElementAttribute("#image", "style"),
        //     "background-image: url(https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/Widgets%2Fmoon.jpg); ",
        //     "Image is refreshed");
        //});
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
