/* jshint expr: true */

(function () {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  describe("Image Settings - e2e Testing", function() {
    var validUrl = "http://s3.amazonaws.com/",
      validImageUrl = "http://s3.amazonaws.com/rise-common/images/logo-small.png",
      invalidImageUrl = "http://s3.amazonaws.com/rise-common/images/small.png";

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    // Loading
    it("Should load toolbar", function () {
      expect(element(by.id("save")).isPresent()).to.eventually.be.true;
    });

    it("Should load URL setting", function () {
      expect(element(by.model("url")).isPresent()).to.eventually.be.true;
    });

    it("Should load background setting", function () {
      expect(element(by.tagName("background-setting")).isPresent()).to.eventually.be.true;
    });

    // Defaults
    it("URL should be empty", function () {
      expect(element(by.model("url")).getAttribute("value")).to.eventually.equal("");
    });

    it("Scale to Fit should be checked", function () {
      expect(element(by.id("scale-to-fit")).isSelected()).to.eventually.be.true;
    });

    // Visibility
    it("URL required error should be shown", function () {
      expect(element(by.id("required-error")).isDisplayed()).to.eventually.be.true;
    });

    it("Invalid image error should be hidden", function () {
      expect(element(by.id("invalid-image-error")).isDisplayed()).to.eventually.be.false;
    });

    it("Scale to Fit should be hidden", function () {
      expect(element(by.id("scale-to-fit")).isDisplayed()).to.eventually.be.false;
    });

    // Validity
    it("ng-valid should be false", function () {
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
    });

    it("Save button should be disabled", function () {
      expect(element(by.css("#save[disabled=disabled")).isPresent()).to.eventually.be.true;
    });

    it("URL required error should be hidden when a valid non-image URL is entered", function () {
      element(by.model("url")).sendKeys(validUrl);
      expect(element(by.id("required-error")).isDisplayed()).to.eventually.be.false;
    });

    it("Invalid image error should be shown when a valid non-image URL is entered", function () {
      element(by.model("url")).sendKeys(validUrl);
      expect(element(by.id("invalid-image-error")).isDisplayed()).to.eventually.be.true;
    });

    it("Save button should be disabled when a valid non-image URL is entered", function () {
      element(by.model("url")).sendKeys(validUrl);
      expect(element(by.css("#save[disabled=disabled]")).isPresent()).to.eventually.be.true;
    });

    it("ng-valid should be false when a valid non-image URL is entered", function () {
      element(by.model("url")).sendKeys(validUrl);
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
    });

    it("URL required error should be hidden when a valid image URL is entered", function () {
      element(by.model("url")).sendKeys(validImageUrl);
      expect(element(by.id("required-error")).isDisplayed()).to.eventually.be.false;
    });

    it("Invalid image error should be hidden when a valid image URL is entered", function () {
      element(by.model("url")).sendKeys(validImageUrl);
      expect(element(by.id("invalid-image-error")).isDisplayed()).to.eventually.be.false;
    });

    it("Save button should be enabled when a valid image URL is entered", function () {
      element(by.model("url")).sendKeys(validImageUrl);
      element(by.id("save")).click();
      expect(element(by.css("#save[disabled=disabled]")).isPresent()).to.eventually.be.false;
    });

    it("ng-valid should be true when a valid image URL is entered", function () {
      element(by.model("url")).sendKeys(validImageUrl);
      element(by.id("save")).click();
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.true;
    });

    it("Invalid image error should be shown when saving an image that does not exist", function () {
      element(by.model("url")).sendKeys(invalidImageUrl);
      element(by.id("save")).click();
      expect(element(by.id("invalid-image-error")).isDisplayed()).to.eventually.be.true;
    });

    it("Invalid image error should be hidden when saving a valid image URL", function () {
      element(by.model("url")).sendKeys(validImageUrl);
      element(by.id("save")).click();
      expect(element(by.id("invalid-image-error")).isDisplayed()).to.eventually.be.false;
    });

    // Saving
    it("Should correctly save settings", function () {
      var settings = {
        "params": {},
        "additionalParams": {
          "url": validImageUrl,
          "storage": {},
          "scaleToFit": true,
          "position": "top-left",
          "background": {
            "color": "transparent"
          }
        }
      };

      element(by.model("url")).sendKeys(validImageUrl);
      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
        "params": "",
        "additionalParams": JSON.stringify(settings.additionalParams)
      });
    });
  });
})();
