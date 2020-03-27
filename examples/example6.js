const {
  List,
  Struct,
  Byte,
  ui8,
  b1,
  b2,
  Pointer,
  Variable,
  ui16,
  b7
} = require("../index.js");
const Buffer = require("buffer/").Buffer;

const Status = Byte.define(
  [
    ["powerOn", b1],
    ["timerEnabled", b7]
    // ["errorFlag", b1],
    // ["presenceSensor", b1],
    // ["geoData", b1],
    // ["deviceTime", b1],
    // ["playerState", b2]
  ],
  ui8,
  "status"
);

const Test = Struct.define([
  ["status", Status],
  ["host", ui8],
  ["ip", List.define(ui8, 4)]
]);
const status = {
  powerOn: 1,
  timerEnabled: 1
  // errorFlag: 1,
  // presenceSensor: 1,
  // geoData: 1,
  // deviceTime: 0,
  // playerState: 3
};
const test = {
  status,
  host: 128,
  home: 123,
  ip: [127, 0, 0, 1]
};
console.log({ Test });
const p = new Pointer(new Buffer(Test.size), 0);
const v = new Variable(Test, p);
v.pack(test);
const unpacked = v.unpack(p);

console.log({ p, unpacked });
