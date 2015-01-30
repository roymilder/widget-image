var require = patchRequire(require);
var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-storage-test-e2e.html";
//var xhr, requests;

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
      // casper.evaluate(function () {
      //   xhr = sinon.useFakeXMLHttpRequest();

      //   xhr.onCreate = function (xhr) {
      //     requests.push(xhr);
      //   };
      // });

      test.assertDoesntExist(".scale-to-fit", "No scale to fit");
      test.assertExists(".top-left", "Alignment");
      test.assertEquals(this.getElementAttribute("body", "style"),
        "background-image: initial; background-attachment: initial; background-origin: initial; " +
        "background-clip: initial; background-color: transparent; " +
        "background-position: initial initial; background-repeat: initial initial; ",
        "Background color");

      // TODO: Figure out why Javascript in web component does not load.
      // casper.evaluate(function () {
      //   var storage = document.querySelector("rise-storage");

      //   storage.go(); //storage.go is undefined
      //   requests[0].respond(200, { "Content-Type": "text/json" },
      //     "https://www.googleapis.com/download/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Ignite_Me_Book_Cover.jpg?generation=1422460196229000&amp;alt=media");
      // });

      // test.assertEquals(this.getElementAttribute("#image", "style"),
      //   "background-image: url(https://www.googleapis.com/download/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Ignite_Me_Book_Cover.jpg?generation=1422460196229000&amp;alt=media); ", "Image");

      casper.evaluate(function () {
        xhr.restore();
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
