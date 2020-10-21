# `struct` for Node.js

Original fork of [streamich/typebase](https://github.com/streamich/typebase#readme)

Read `docco` docs at [here](https://jfamousket.github.io/meshle-typebase/).

```
npm install https://github.com/jfamousket/meshle-typebase
```

```
yarn add https://github.com/jfamousket/meshle-typebase
```

Consider a `C/C++` structure:

```c
struct address {
    ...
    int port,
    int host,
    unsigned char ip[4],
    int status,
}
```

Lets say the 2 `bytes` for your status had specific values for different `bit` positions

```js
const t = require("../typebase.js");

const Status = t.Bytes.define(
  [
    ["powerOn", t.b1],
    ["timerEnabled", t.b1],
    ["errorFlag", t.b1],
    ["presenceSensor", t.b1],
    ["geoData", t.b1],
    ["deviceTime", t.b1],
    ["playerState", t.b7],
  ],
  t.ui16,
  "status"
);

const status = {
  powerOn: 1,
  timerEnabled: 1,
  errorFlag: 1,
  presenceSensor: 1,
  geoData: 1,
  deviceTime: 0,
  playerState: 100,
};
```

Define the same binary `struct` in JavaScript and pack/unpack data to `Buffer`:

```js
const address = t.Struct.define([
  ["port", t.ui8],
  ["host", t.ui8],
  ["ip", t.List.define(t.ui8, 4)],
  ["status", Status],
]);

const host = {
  port: 8080,
  host: 128,
  ip: [127, 0, 0, 1],
  status,
};

const pointer = new t.Pointer(new Buffer(address.size), 0);
address.pack(pointer, host);
const unpacked = address.unpack(pointer);

console.log({ pointer, unpacked });
```
