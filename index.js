"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.t_void = exports.sui8 = exports.sui32 = exports.sui16 = exports.bui64 = exports.bi64 = exports.bui32 = exports.bi32 = exports.bui16 = exports.bi16 = exports.ui64 = exports.i64 = exports.ui32 = exports.i32 = exports.ui16 = exports.i16 = exports.ui8 = exports.i8 = exports.b7 = exports.b6 = exports.b5 = exports.b4 = exports.b3 = exports.b2 = exports.b1 = exports.Variable = exports.ByteArr = exports.Byte = exports.IByteField = exports.Struct = exports.IStructField = exports.List = exports.Bit = exports.String = exports.Primitive = exports.Pointer = void 0;
if (typeof process !== "object") {
    console.log("Running in browser");
    global.Buffer = require("buffer/").Buffer;
}
var Pointer = (function () {
    function Pointer(buf, offset) {
        if (offset === void 0) { offset = 0; }
        this.buf = buf;
        this.off = offset;
    }
    Pointer.prototype.clone = function () {
        return this.offset();
    };
    Pointer.prototype.offset = function (off) {
        if (off === void 0) { off = 0; }
        return new Pointer(this.buf, this.off + off);
    };
    return Pointer;
}());
exports.Pointer = Pointer;
var Primitive = (function () {
    function Primitive() {
        this.size = 0;
    }
    Primitive.define = function (size, onPack, onUnpack, name) {
        if (size === void 0) { size = 1; }
        if (onPack === void 0) { onPack = (function () { }); }
        if (onUnpack === void 0) { onUnpack = (function () { }); }
        if (name === void 0) { name = ""; }
        var field = new Primitive();
        field.size = size;
        field.name = name;
        field.onPack = onPack;
        field.onUnpack = onUnpack;
        return field;
    };
    Primitive.prototype.pack = function (p, value) {
        this.onPack.call(p.buf, value, p.off);
    };
    Primitive.prototype.unpack = function (p) {
        return this.onUnpack.call(p.buf, p.off);
    };
    return Primitive;
}());
exports.Primitive = Primitive;
var String = (function () {
    function String() {
        this.size = 0;
        this.encoding = "utf8";
    }
    String.define = function (encoding, type, onPack, onUnpack, name) {
        if (onPack === void 0) { onPack = (function () { }); }
        if (onUnpack === void 0) { onUnpack = (function () { }); }
        if (name === void 0) { name = ""; }
        var field = new String();
        field.encoding = encoding;
        field.size = type.size;
        field.name = name;
        field.onPack = onPack;
        field.onUnpack = onUnpack;
        return field;
    };
    String.prototype.pack = function (p, value) {
        this.onPack.call(p.buf, value, p.off, this.size, this.encoding);
    };
    String.prototype.unpack = function (p) {
        return this.onUnpack.call(p.buf, this.encoding, p.off, p.off + this.size);
    };
    return String;
}());
exports.String = String;
var Bit = (function () {
    function Bit() {
        this.size = 0;
    }
    Bit.define = function (size) {
        if (size === void 0) { size = 1; }
        var bit = new Bit();
        bit.size = size;
        return bit;
    };
    return Bit;
}());
exports.Bit = Bit;
var List = (function () {
    function List() {
        this.size = 0;
        this.length = 0;
    }
    List.define = function (type, length) {
        if (length === void 0) { length = 0; }
        var list = new List();
        list.type = type;
        list.length = length;
        list.size = length * type.size;
        return list;
    };
    List.prototype.pack = function (p, values, length) {
        if (length === void 0) { length = this.length; }
        var valp = p.clone();
        if (!(values instanceof Array))
            values = [values];
        if (!length)
            length = values.length;
        length = Math.min(length, values.length);
        for (var i = 0; i < length; i++) {
            this.type.pack(valp, values[i]);
            valp.off += this.type.size;
        }
    };
    List.prototype.unpack = function (p, length) {
        if (length === void 0) { length = this.length; }
        var values = [];
        var valp = p.clone();
        for (var i = 0; i < length; i++) {
            values.push(this.type.unpack(valp));
            valp.off += this.type.size;
        }
        return values;
    };
    return List;
}());
exports.List = List;
var IStructField = (function () {
    function IStructField() {
    }
    return IStructField;
}());
exports.IStructField = IStructField;
var Struct = (function () {
    function Struct(fields, name) {
        this.size = 0;
        this.fields = [];
        this.map = {};
        this.addFields(fields);
        console.log(name);
        this.name = name;
        this.fieldsDefinition = fields;
    }
    Struct.define = function (fields, name) {
        if (name === void 0) { name = ""; }
        return new Struct(fields, name);
    };
    Struct.prototype.addFields = function (fields) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            if (field instanceof Struct) {
                var parent = field;
                var parentfields = parent.fields.map(function (field) {
                    return [field.name, field.type];
                });
                this.addFields(parentfields);
                continue;
            }
            var fielddef = field;
            var name = fielddef[0], struct = fielddef[1];
            var entry = {
                type: struct,
                offset: this.size,
                name: name,
            };
            this.fields.push(entry);
            this.map[name] = entry;
            this.size += struct.size;
        }
    };
    Struct.prototype.pack = function (p, data) {
        var fp = p.clone();
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            field.type.pack(fp, data[field.name]);
            fp.off += field.type.size;
        }
    };
    Struct.prototype.unpack = function (p) {
        var data = {};
        var fp = p.clone();
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            data[field.name] = field.type.unpack(fp);
            fp.off += field.type.size;
        }
        return data;
    };
    return Struct;
}());
exports.Struct = Struct;
var IByteField = (function () {
    function IByteField() {
    }
    return IByteField;
}());
exports.IByteField = IByteField;
var Byte = (function () {
    function Byte(bits, type, name) {
        this.size = 0;
        this.off = 0;
        this.bits = [];
        this.map = {};
        this.addBits(bits);
        this.size = type.size;
        this.name = name;
        this.type = type;
        this.bitsDefinition = bits;
    }
    Byte.define = function (bits, type, name) {
        if (name === void 0) { name = ""; }
        return new Byte(bits, type, name);
    };
    Byte.prototype.addBits = function (bits) {
        for (var _i = 0, bits_1 = bits; _i < bits_1.length; _i++) {
            var bit = bits_1[_i];
            var bitDef = bit;
            var name = bitDef[0], bitType = bitDef[1];
            if (!(bitType instanceof Bit))
                throw new Error("Bytes can only contain bits");
            var entry = {
                type: bitType,
                offset: this.off,
                name: name,
            };
            this.bits.push(entry);
            this.map[name] = entry;
            this.off += bitType.size;
        }
    };
    Byte.prototype.padBit = function (bit, size) {
        bit = bit.toString();
        while (bit.length < size)
            bit = "0" + bit;
        return bit;
    };
    Byte.prototype.pack = function (p, data) {
        var _this = this;
        var fp = p.clone();
        var binaryNum = "0b" +
            this.bits
                .map(function (b) {
                var d = data[b.name];
                d = Number(d).toString(2);
                d = _this.padBit(d, b.type.size);
                return d.toString(2);
            })
                .join("");
        this.type.pack(fp, Number(binaryNum));
        fp.off += this.size;
    };
    Byte.prototype.unpack = function (p) {
        var data = {};
        var fp = p.clone();
        var offset = 0;
        var binaryNum = this.type.unpack(fp);
        if (!(typeof binaryNum === "number"))
            throw new Error("invalid pointer passed to unpack function");
        binaryNum = this.padBit(binaryNum.toString(2), this.type.size * 8);
        for (var _i = 0, _a = this.bits; _i < _a.length; _i++) {
            var bit = _a[_i];
            var decimalNum = binaryNum.slice(offset, offset + bit.type.size);
            decimalNum = "0b" + this.padBit(decimalNum, bit.type.size);
            decimalNum = Number(decimalNum);
            data[bit.name] = Number(decimalNum.toString(10));
            offset += bit.type.size;
        }
        fp.off += this.type.size;
        return data;
    };
    return Byte;
}());
exports.Byte = Byte;
var ByteArr = (function (_super) {
    __extends(ByteArr, _super);
    function ByteArr(bits, type, name) {
        if (name === void 0) { name = ""; }
        return _super.call(this, bits, type, name) || this;
    }
    ByteArr.define = function (bits, type, name) {
        if (name === void 0) { name = ""; }
        if (type.size !== bits / 8)
            throw new Error("Too many bits for " + type.size + " byte(s)");
        return new ByteArr(new Array(bits).fill(0).map(function (v, i) { return ["" + i, exports.b1]; }), type, name);
    };
    ByteArr.prototype.unpack = function (p) {
        return Object.values(_super.prototype.unpack.call(this, p)).reverse();
    };
    ByteArr.prototype.getArr = function (data) {
        var p = new Pointer(new Buffer(this.type.size), 0);
        var v = new Variable(this.type, p);
        v.pack(data);
        return this.unpack(p);
    };
    ByteArr.prototype.pack = function (p, data) {
        if (!(data instanceof Array))
            data = this.getArr(data);
        data = new Array(this.type.size * 8)
            .fill(0)
            .map(function (v, i) { return data[i] || v; })
            .reverse()
            .reduce(function (a, c, i) {
            a["" + i] = c;
            return a;
        }, {});
        _super.prototype.pack.call(this, p, data);
    };
    return ByteArr;
}(Byte));
exports.ByteArr = ByteArr;
var Variable = (function () {
    function Variable(type, pointer) {
        this.type = type;
        this.pointer = pointer;
    }
    Variable.prototype.pack = function (data) {
        this.type.pack(this.pointer, data);
    };
    Variable.prototype.unpack = function (length) {
        return this.type.unpack(this.pointer, length);
    };
    Variable.prototype.cast = function (newtype) {
        this.type = newtype;
    };
    Variable.prototype.get = function (name) {
        if (!(this.type instanceof Struct))
            throw Error("Variable is not a `Struct`.");
        var struct = this.type;
        var field = struct.map[name];
        var p = this.pointer.clone();
        p.off += field.offset;
        return new Variable(field.type, p);
    };
    return Variable;
}());
exports.Variable = Variable;
var bp = Buffer.prototype || Buffer.from([]);
exports.b1 = Bit.define(1);
exports.b2 = Bit.define(2);
exports.b3 = Bit.define(3);
exports.b4 = Bit.define(4);
exports.b5 = Bit.define(5);
exports.b6 = Bit.define(6);
exports.b7 = Bit.define(7);
exports.i8 = Primitive.define(1, bp.writeInt8, bp.readInt8);
exports.ui8 = Primitive.define(1, bp.writeUInt8, bp.readUInt8);
exports.i16 = Primitive.define(2, bp.writeInt16LE, bp.readInt16LE);
exports.ui16 = Primitive.define(2, bp.writeUInt16LE, bp.readUInt16LE);
exports.i32 = Primitive.define(4, bp.writeInt32LE, bp.readInt32LE);
exports.ui32 = Primitive.define(4, bp.writeUInt32LE, bp.readUInt32LE);
exports.i64 = List.define(exports.i32, 2);
exports.ui64 = List.define(exports.ui32, 2);
exports.bi16 = Primitive.define(2, bp.writeInt16BE, bp.readInt16BE);
exports.bui16 = Primitive.define(2, bp.writeUInt16BE, bp.readUInt16BE);
exports.bi32 = Primitive.define(4, bp.writeInt32BE, bp.readInt32BE);
exports.bui32 = Primitive.define(4, bp.writeUInt32BE, bp.readUInt32BE);
exports.bi64 = List.define(exports.bi32, 2);
exports.bui64 = List.define(exports.bui32, 2);
exports.sui16 = String.define("utf8", exports.ui16, bp.write, bp.toString);
exports.sui32 = String.define("utf8", exports.ui32, bp.write, bp.toString);
exports.sui8 = String.define("utf8", exports.ui8, bp.write, bp.toString);
exports.t_void = Primitive.define(0);
