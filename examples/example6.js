const {
  List,
  Struct,
  Bytes,
  ui8,
  b1,
  b2,
  Pointer,
  ui16
} = require("../typebase.js");

const Status = Bytes.define(
  [
    ["powerOn", b1],
    ["timerEnabled", b1],
    ["errorFlag", b1],
    ["presenceSensor", b1],
    ["geoData", b1],
    ["deviceTime", b1],
    ["playerState", b2]
  ],
  ui8,
  "status"
);

const Test = Struct.define([
  ["status", Status][("host", ui8)],
  ["ip", List.define(ui8, 4)]
]);
const status = {
  powerOn: 1,
  timerEnabled: 1,
  errorFlag: 1,
  presenceSensor: 1,
  geoData: 1,
  deviceTime: 0,
  playerState: 3
};
const test = {
  status,
  host: 128,
  ip: [127, 0, 0, 1]
};

const p = new Pointer(new Buffer(Test.size), 0);
Test.pack(p, test);
const unpacked = Test.unpack(p);

console.log({ p, unpacked });
