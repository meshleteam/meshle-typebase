const {
  List,
  Struct,
  Byte,
  ui8,
  b1,
  Pointer,
  Variable,
  ui16,
  b2,
  sui16,
  ByteArr,
} = require("../index.js");
const Buffer = require("buffer/").Buffer;

const Status = Byte.define(
  [
    ["playerState", b2],
    ["deviceTime", b1],
    ["geoData", b1],
    ["presenceSensor", b1],
    ["errorFlag", b1],
    ["timerEnabled", b1],
    ["powerOn", b1],
  ],
  ui8,
  "status"
);

const Type = Struct.define([
  ["type", ByteArr.define(8, ui8)],
]) 
const Header = Struct.define([
  Type,
  ["status", Status],
]);

const Test = Struct.define([
  Header,
  ["strTest", sui16],
  ["host", ui16],
  ["ip", List.define(ui8, 4)],
]);

const status = {
  powerOn: 0,
  timerEnabled: 0,
  errorFlag: 0,
  presenceSensor: 0,
  geoData: 0,
  deviceTime: 1,
  playerState: 0,
};
const test = {
  type: 11,
  status,
  strTest: "VP",
  host: 128,
  ip: [127, 0, 0, 1],
};
console.log({ Test });
const p = new Pointer(new Buffer(Test.size), 0);
const v = new Variable(Test, p);
v.pack(test);
const unpacked = v.unpack(p);

console.log({ buffer: p.buf, unpacked });
