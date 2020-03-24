const { Struct, Bit, Bytes, b1, b3, Pointer, ui16 } = require("../typebase.js");

const Status = Bytes.define(
  [
    ["powerOn", b1],
    ["timerEnabled", b1],
    ["errorFlag", b1],
    ["presenceSensor", b1],
    ["geoData", b1],
    ["deviceTime", b1],
    ["playerState", b3]
  ],
  ui16,
  "status"
);

const Test = Struct.define([["status", Status]]);
const status = {
  powerOn: 1,
  timerEnabled: 1,
  errorFlag: 1,
  presenceSensor: 1,
  geoData: 1,
  deviceTime: 0,
  playerState: 7
};
const test = {
  status
};

const p = new Pointer(new Buffer(Test.size), 0);
Test.pack(p, test);
console.log({ p, Test, Status });
