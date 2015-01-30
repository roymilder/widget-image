var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.test.begin("Image Widget - URL - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Widget", "Test page has loaded");
    });

    casper.then(function () {
      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadImage() {
          return document.getElementById("image").getAttribute("style") !== "";
        });
      },
      function then() {
        test.assertExists(".scale-to-fit", "Scale to fit");
        test.assertExists(".middle-center", "Alignment");
        test.assertEquals(this.getElementAttribute("#image", "style"),
          "background-image: url(http://s3.amazonaws.com/rise-common/images/logo-small.png); ", "Image");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: rgb(204, 204, 204); " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
