import { Buffer } from "buffer/";
export declare class Pointer {
  buf: Buffer;
  off: number;
  constructor(buf: Buffer, offset?: number);
  clone(): Pointer;
  offset(off?: number): Pointer;
}
export interface IType {
  size: number;
  name: string;
  pack(p: Pointer, data: any): any;
  unpack(p: Pointer, length?: number): any;
}
export declare class Primitive implements IType {
  static define(
    size?: number,
    onPack?: any,
    onUnpack?: any,
    name?: string
  ): Primitive;
  size: number;
  name: string;
  onPack: (value: any, offset: any) => void;
  onUnpack: (offset: number) => any;
  pack(p: Pointer, value: any): void;
  unpack(p: Pointer): any;
}
export declare type encoding =
  | "utf8"
  | "utf16le"
  | "latin1"
  | "base64"
  | "hex"
  | "ascii"
  | "binary"
  | "ucs2";
export declare class String implements IType {
  static define(
    encoding: encoding,
    type: IType,
    onPack?: any,
    onUnpack?: any,
    name?: string
  ): String;
  size: number;
  encoding: encoding;
  name: string;
  onPack: (value: any, offset: any) => void;
  onUnpack: (offset: number) => any;
  pack(p: Pointer, value: any): void;
  unpack(p: Pointer): any;
}
export declare class Bit {
  static define(size?: number): Bit;
  size: number;
}
export declare class List implements IType {
  static define(type: IType, length?: number): List;
  size: number;
  name: string;
  type: IType;
  length: number;
  pack(p: Pointer, values: any[], length?: number): void;
  unpack(p: Pointer, length?: number): any;
}
export declare class IStructField {
  type: IType;
  offset: number;
  name: string;
}
export declare type IFieldDefinition = [string, IType] | Struct;
export declare class Struct implements IType {
  static define(fields: IFieldDefinition[], name?: string): Struct;
  fieldsDefinition: IFieldDefinition[];
  size: number;
  name: string;
  fields: IStructField[];
  map: {
    [s: string]: IStructField;
  };
  constructor(fields: IFieldDefinition[], name: string);
  protected addFields(fields: IFieldDefinition[]): void;
  pack(p: Pointer, data: any): void;
  unpack(p: Pointer): any;
}
export declare class IByteField {
  type: Bit;
  offset: number;
  name: string;
}
export declare type IBitDefinition = [string, Bit] | Byte;
export declare class Byte implements IType {
  static define(bits: IBitDefinition[], type: IType, name?: string): Byte;
  size: number;
  off: number;
  type: IType;
  name: string;
  bitsDefinition: IBitDefinition[];
  bits: IByteField[];
  map: {
    [s: string]: IByteField;
  };
  constructor(bits: IBitDefinition[], type: IType, name: string);
  protected addBits(bits: IBitDefinition[]): void;
  protected padBit(bit: string, size: number): string;
  pack(p: Pointer, data: any): void;
  unpack(p: Pointer): any;
}
//@ts-ignore
export declare class ByteArr extends Byte {
  static define(bits: number, type: IType, name?: string): ByteArr;
  constructor(bits: IBitDefinition[], type: IType, name?: string);
  unpack(p: Pointer): unknown[];
  pack(p: Pointer, data: Array<any>): void;
}
export declare class Variable {
  type: IType;
  pointer: Pointer;
  constructor(type: IType, pointer: Pointer);
  pack(data: any): void;
  unpack(length?: any): any;
  cast(newtype: IType): void;
  get(name: string): Variable;
}
export declare var b1: Bit;
export declare var b2: Bit;
export declare var b3: Bit;
export declare var b4: Bit;
export declare var b5: Bit;
export declare var b6: Bit;
export declare var b7: Bit;
export declare var i8: Primitive;
export declare var ui8: Primitive;
export declare var i16: Primitive;
export declare var ui16: Primitive;
export declare var i32: Primitive;
export declare var ui32: Primitive;
export declare var i64: List;
export declare var ui64: List;
export declare var bi16: Primitive;
export declare var bui16: Primitive;
export declare var bi32: Primitive;
export declare var bui32: Primitive;
export declare var bi64: List;
export declare var bui64: List;
export declare var sui16: String;
export declare var sui32: String;
export declare var sui8: String;
export declare var t_void: Primitive;
