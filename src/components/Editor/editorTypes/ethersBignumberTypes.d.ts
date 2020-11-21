declare type Bytes = ArrayLike<number>
declare type BytesLike = Bytes | string
declare type DataOptions = {
  allowMissingPrefix?: boolean
  hexPad?: 'left' | 'right' | null
}
declare interface Hexable {
  toHexString(): string
}
declare type SignatureLike =
  | {
    r: string
    s?: string
    _vs?: string
    recoveryParam?: number
    v?: number
  }
  | BytesLike
declare interface Signature {
  r: string
  s: string
  _vs: string
  recoveryParam: number
  v: number
}
declare function isBytesLike(value: any): value is BytesLike
declare function isBytes(value: any): value is Bytes
declare function arrayify(value: BytesLike | Hexable | number, options?: DataOptions): Uint8Array
declare function concat(items: Array<BytesLike>): Uint8Array
declare function stripZeros(value: BytesLike): Uint8Array
declare function zeroPad(value: BytesLike, length: number): Uint8Array
declare function isHexString(value: any, length?: number): boolean
declare function hexlify(value: BytesLike | Hexable | number, options?: DataOptions): string
declare function hexDataLength(data: BytesLike): number
declare function hexDataSlice(data: BytesLike, offset: number, endOffset?: number): string
declare function hexConcat(items: Array<BytesLike>): string
declare function hexValue(value: BytesLike | Hexable | number): string
declare function hexStripZeros(value: BytesLike): string
declare function hexZeroPad(value: BytesLike, length: number): string
declare function splitSignature(signature: SignatureLike): Signature
declare function joinSignature(signature: SignatureLike): string

declare type BigNumberish = BigNumber | Bytes | string | number
declare function isBigNumberish(value: any): value is BigNumberish
declare class BigNumber implements Hexable {
  readonly _hex: string
  readonly _isBigNumber: boolean
  constructor(constructorGuard: any, hex: string)
  fromTwos(value: number): BigNumber
  toTwos(value: number): BigNumber
  abs(): BigNumber
  add(other: BigNumberish): BigNumber
  sub(other: BigNumberish): BigNumber
  div(other: BigNumberish): BigNumber
  mul(other: BigNumberish): BigNumber
  mod(other: BigNumberish): BigNumber
  pow(other: BigNumberish): BigNumber
  and(other: BigNumberish): BigNumber
  or(other: BigNumberish): BigNumber
  xor(other: BigNumberish): BigNumber
  mask(value: number): BigNumber
  shl(value: number): BigNumber
  shr(value: number): BigNumber
  eq(other: BigNumberish): boolean
  lt(other: BigNumberish): boolean
  lte(other: BigNumberish): boolean
  gt(other: BigNumberish): boolean
  gte(other: BigNumberish): boolean
  isNegative(): boolean
  isZero(): boolean
  toNumber(): number
  toString(): string
  toHexString(): string
  static from(value: any): BigNumber
  static isBigNumber(value: any): value is BigNumber
}
