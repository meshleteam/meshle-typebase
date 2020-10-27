
const {
  List,
  Struct,
  ui8,
  Pointer,
  Variable,
    String
} = require("../index.js");
const Buffer = require("buffer/").Buffer;

const bp = Buffer.prototype
const SetWotaConfigDirectPayload = Struct.define([
  ["checkUpdateEnabled", ui8],
]);

const args = {
    checkUpdateEnabled: true,
    serverUrl: "https://meshle.com",
    null: 0,
}
const url = new Buffer(args.serverUrl, "ascii");
const ServerUrl = List.define(ui8, url.byteLength);
const struct = Struct.define([
    SetWotaConfigDirectPayload,
    ["serverUrl", String.define("ascii", ServerUrl, bp.write, bp.toString)],
    ["null", ui8],
]);

const p = new Pointer(new Buffer(struct.size), 0);
const v = new Variable(struct, p);
v.pack(args);
const unpacked = v.unpack(p);

console.log({ p, unpacked });