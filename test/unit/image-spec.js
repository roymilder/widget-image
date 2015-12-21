"use strict";

describe("getTableName", function() {
  it("should return the correct table name", function() {
    expect(RiseVision.Image.getTableName(), "image_events");
  });
});

describe("play", function() {
  it("should call spy with correct parameters", function() {
    var params = {
        "event": "play",
        "file_url": ""
      },
      logSpy = sinon.spy(RiseVision.Common.Logger, "log");

    RiseVision.Image.play();

    expect(logSpy).to.have.been.calledWith("image_events", params);

    RiseVision.Common.Logger.log.restore();
  });
});
