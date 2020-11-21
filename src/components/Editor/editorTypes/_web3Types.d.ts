/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Bzz {
  constructor()
  constructor(provider: any)

  readonly givenProvider: any
  static readonly givenProvider: any
  readonly currentProvider: any
  setProvider(provider: any): boolean

  upload(data: any): Promise<string>

  download(bzzHash: string, localPath?: string): Promise<any>

  pick: Pick
}

declare interface Pick {
  file: () => Promise<any>
  directory: () => Promise<any>
  data: () => Promise<any>
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class formatters {
  static outputBigNumberFormatter(number: number): number

  static inputSignFormatter(data: string): string

  static inputAddressFormatter(address: string): string

  static isPredefinedBlockNumber(blockNumber: string): boolean

  static inputDefaultBlockNumberFormatter(blockNumber: string): string

  static inputBlockNumberFormatter(blockNumber: string | number): string | number

  static outputBlockFormatter(block: any): any // TODO: Create Block interface

  static txInputFormatter(txObject: any): any

  static inputCallFormatter(txObject: any): any

  static inputTransactionFormatter(txObject: any): any

  static outputTransactionFormatter(receipt: any): any

  static outputTransactionReceiptFormatter(receipt: any): any

  static inputLogFormatter(log: any): any

  static outputLogFormatter(log: any): any

  static inputPostFormatter(post: any): any // TODO: Create Post interface

  static outputPostFormatter(post: any): any // TODO: Create Post interface

  static outputSyncingFormatter(result: any): any // TODO: Create SyncLog interface
}

declare class errors {
  static ErrorResponse(result: Error): Error
  static InvalidNumberOfParams(got: number, expected: number, method: string): Error
  static InvalidConnection(host: string): Error
  static InvalidProvider(): Error
  static InvalidResponse(result: Error): Error
  static ConnectionTimeout(ms: string): Error
}

declare class WebsocketProviderBase {
  constructor(host: string, options?: WebsocketProviderOptions)

  isConnecting(): boolean

  responseCallbacks: any
  notificationCallbacks: any
  connected: boolean
  connection: any

  addDefaultEvents(): void

  supportsSubscriptions(): boolean

  send(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void

  on(type: string, callback: () => void): void

  once(type: string, callback: () => void): void

  removeListener(type: string, callback: () => void): void

  removeAllListeners(type: string): void

  reset(): void

  disconnect(code: number, reason: string): void
}

declare class IpcProviderBase {
  constructor(path: string, net: net.Server)

  responseCallbacks: any
  notificationCallbacks: any
  connected: boolean
  connection: any

  addDefaultEvents(): void

  supportsSubscriptions(): boolean

  send(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void

  on(type: string, callback: () => void): void

  once(type: string, callback: () => void): void

  removeListener(type: string, callback: () => void): void

  removeAllListeners(type: string): void

  reset(): void

  reconnect(): void
}

declare class HttpProviderBase {
  constructor(host: string, options?: HttpProviderOptions)

  host: string
  connected: boolean

  supportsSubscriptions(): boolean

  send(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void

  disconnect(): boolean
}

declare interface HttpProviderOptions {
  keepAlive?: boolean
  timeout?: number
  headers?: HttpHeader[]
  withCredentials?: boolean
}

declare interface HttpHeader {
  name: string
  value: string
}

declare interface WebsocketProviderOptions {
  host?: string
  timeout?: number
  reconnectDelay?: number
  headers?: any
  protocol?: string
  clientConfig?: string
  requestOptions?: any
  origin?: string
}

declare interface JsonRpcPayload {
  jsonrpc: string
  method: string
  params: any[]
  id?: string | number
}

declare interface JsonRpcResponse {
  jsonrpc: string
  id: number
  result?: any
  error?: string
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

declare interface Method {
  name: string
  call: string
  params?: number
  inputFormatter?: Array<(() => void) | null>
  outputFormatter?: () => void
  transformPayload?: () => void
  extraFormatters?: any
  defaultBlock?: string
  defaultAccount?: string | null
}

// Type definitions for bn.js 4.11
// Project: https://github.com/indutny/bn.js
// Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
//                 Henry Nguyen <https://github.com/HenryNguyen5>
//                 Gaylor Bosson <https://github.com/Gilthoniel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>

type Endianness = 'le' | 'be'
type IPrimeName = 'k256' | 'p224' | 'p192' | 'p25519'

interface MPrime {
  name: string
  p: BN
  n: number
  k: BN
}

interface ReductionContext {
  m: number
  prime: MPrime
  [key: string]: any
}

declare class BN {
  constructor(number: number | string | number[] | Uint8Array | Buffer | BN, base?: number | 'hex', endian?: Endianness)
  constructor(number: number | string | number[] | Uint8Array | Buffer | BN, endian?: Endianness)

  /**
   * @description  create a reduction context
   */
  static red(reductionContext: BN | IPrimeName): ReductionContext

  /**
   * @description  create a reduction context  with the Montgomery trick.
   */
  static mont(num: BN): ReductionContext

  /**
   * @description returns true if the supplied object is a BN.js instance
   */
  static isBN(b: any): b is BN

  /**
   * @description returns the maximum of 2 BN instances.
   */
  static max(left: BN, right: BN): BN

  /**
   * @description returns the minimum of 2 BN instances.
   */
  static min(left: BN, right: BN): BN

  /**
   * @description  clone number
   */
  clone(): BN

  /**
   * @description  convert to base-string and pad with zeroes
   */
  toString(base?: number | 'hex', length?: number): string

  /**
   * @description convert to Javascript Number (limited to 53 bits)
   */
  toNumber(): number

  /**
   * @description convert to JSON compatible hex string (alias of toString(16))
   */
  toJSON(): string

  /**
   * @description  convert to byte Array, and optionally zero pad to length, throwing if already exceeding
   */
  toArray(endian?: Endianness, length?: number): number[]

  /**
   * @description convert to an instance of `type`, which must behave like an Array
   */
  toArrayLike(ArrayType: typeof Buffer, endian?: Endianness, length?: number): Buffer

  toArrayLike(ArrayType: any[], endian?: Endianness, length?: number): any[]

  /**
   * @description  convert to Node.js Buffer (if available). For compatibility with browserify and similar tools, use this instead: a.toArrayLike(Buffer, endian, length)
   */
  toBuffer(endian?: Endianness, length?: number): Buffer

  /**
   * @description get number of bits occupied
   */
  bitLength(): number

  /**
   * @description return number of less-significant consequent zero bits (example: 1010000 has 4 zero bits)
   */
  zeroBits(): number

  /**
   * @description return number of bytes occupied
   */
  byteLength(): number

  /**
   * @description  true if the number is negative
   */
  isNeg(): boolean

  /**
   * @description  check if value is even
   */
  isEven(): boolean

  /**
   * @description   check if value is odd
   */
  isOdd(): boolean

  /**
   * @description  check if value is zero
   */
  isZero(): boolean

  /**
   * @description compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result
   */
  cmp(b: BN): -1 | 0 | 1

  /**
   * @description compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result
   */
  ucmp(b: BN): -1 | 0 | 1

  /**
   * @description compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result
   */
  cmpn(b: number): -1 | 0 | 1

  /**
   * @description a less than b
   */
  lt(b: BN): boolean

  /**
   * @description a less than b
   */
  ltn(b: number): boolean

  /**
   * @description a less than or equals b
   */
  lte(b: BN): boolean

  /**
   * @description a less than or equals b
   */
  lten(b: number): boolean

  /**
   * @description a greater than b
   */
  gt(b: BN): boolean

  /**
   * @description a greater than b
   */
  gtn(b: number): boolean

  /**
   * @description a greater than or equals b
   */
  gte(b: BN): boolean

  /**
   * @description a greater than or equals b
   */
  gten(b: number): boolean

  /**
   * @description a equals b
   */
  eq(b: BN): boolean

  /**
   * @description a equals b
   */
  eqn(b: number): boolean

  /**
   * @description convert to two's complement representation, where width is bit width
   */
  toTwos(width: number): BN

  /**
   * @description  convert from two's complement representation, where width is the bit width
   */
  fromTwos(width: number): BN

  /**
   * @description negate sign
   */
  neg(): BN

  /**
   * @description negate sign
   */
  ineg(): BN

  /**
   * @description absolute value
   */
  abs(): BN

  /**
   * @description absolute value
   */
  iabs(): BN

  /**
   * @description addition
   */
  add(b: BN): BN

  /**
   * @description  addition
   */
  iadd(b: BN): BN

  /**
   * @description addition
   */
  addn(b: number): BN

  /**
   * @description addition
   */
  iaddn(b: number): BN

  /**
   * @description subtraction
   */
  sub(b: BN): BN

  /**
   * @description subtraction
   */
  isub(b: BN): BN

  /**
   * @description subtraction
   */
  subn(b: number): BN

  /**
   * @description subtraction
   */
  isubn(b: number): BN

  /**
   * @description multiply
   */
  mul(b: BN): BN

  /**
   * @description multiply
   */
  imul(b: BN): BN

  /**
   * @description multiply
   */
  muln(b: number): BN

  /**
   * @description multiply
   */
  imuln(b: number): BN

  /**
   * @description square
   */
  sqr(): BN

  /**
   * @description square
   */
  isqr(): BN

  /**
   * @description raise `a` to the power of `b`
   */
  pow(b: BN): BN

  /**
   * @description divide
   */
  div(b: BN): BN

  /**
   * @description divide
   */
  divn(b: number): BN

  /**
   * @description divide
   */
  idivn(b: number): BN

  /**
   * @description reduct
   */
  mod(b: BN): BN

  /**
   * @description reduct
   */
  umod(b: BN): BN

  /**
   * @see API consistency https://github.com/indutny/bn.js/pull/130
   * @description reduct
   */
  modn(b: number): number

  /**
   * @description  rounded division
   */
  divRound(b: BN): BN

  /**
   * @description or
   */
  or(b: BN): BN

  /**
   * @description or
   */
  ior(b: BN): BN

  /**
   * @description or
   */
  uor(b: BN): BN

  /**
   * @description or
   */
  iuor(b: BN): BN

  /**
   * @description and
   */
  and(b: BN): BN

  /**
   * @description and
   */
  iand(b: BN): BN

  /**
   * @description and
   */
  uand(b: BN): BN

  /**
   * @description and
   */
  iuand(b: BN): BN

  /**
   * @description and (NOTE: `andln` is going to be replaced with `andn` in future)
   */
  andln(b: number): BN

  /**
   * @description xor
   */
  xor(b: BN): BN

  /**
   * @description xor
   */
  ixor(b: BN): BN

  /**
   * @description xor
   */
  uxor(b: BN): BN

  /**
   * @description xor
   */
  iuxor(b: BN): BN

  /**
   * @description set specified bit to 1
   */
  setn(b: number): BN

  /**
   * @description shift left
   */
  shln(b: number): BN

  /**
   * @description shift left
   */
  ishln(b: number): BN

  /**
   * @description shift left
   */
  ushln(b: number): BN

  /**
   * @description shift left
   */
  iushln(b: number): BN

  /**
   * @description shift right
   */
  shrn(b: number): BN

  /**
   * @description shift right (unimplemented https://github.com/indutny/bn.js/blob/master/lib/bn.js#L2086)
   */
  ishrn(b: number): BN

  /**
   * @description shift right
   */
  ushrn(b: number): BN
  /**
   * @description shift right
   */

  iushrn(b: number): BN
  /**
   * @description  test if specified bit is set
   */

  testn(b: number): boolean
  /**
   * @description clear bits with indexes higher or equal to `b`
   */

  maskn(b: number): BN
  /**
   * @description clear bits with indexes higher or equal to `b`
   */

  imaskn(b: number): BN
  /**
   * @description add `1 << b` to the number
   */
  bincn(b: number): BN

  /**
   * @description not (for the width specified by `w`)
   */
  notn(w: number): BN

  /**
   * @description not (for the width specified by `w`)
   */
  inotn(w: number): BN

  /**
   * @description GCD
   */
  gcd(b: BN): BN

  /**
   * @description Extended GCD results `({ a: ..., b: ..., gcd: ... })`
   */
  egcd(b: BN): { a: BN; b: BN; gcd: BN }

  /**
   * @description inverse `a` modulo `b`
   */
  invm(b: BN): BN

  /**
   * @description Convert number to red
   */
  toRed(reductionContext: ReductionContext): RedBN
}

/**
 * Big-Number class with additionnal methods that are using modular
 * operation.
 */
declare class RedBN extends BN {
  /**
   * @description Convert back a number using a reduction context
   */
  fromRed(): BN

  /**
   * @description modular addition
   */
  redAdd(b: BN): RedBN

  /**
   * @description in-place modular addition
   */
  redIAdd(b: BN): RedBN

  /**
   * @description modular subtraction
   */
  redSub(b: BN): RedBN

  /**
   * @description in-place modular subtraction
   */
  redISub(b: BN): RedBN

  /**
   * @description modular shift left
   */
  redShl(num: number): RedBN

  /**
   * @description modular multiplication
   */
  redMul(b: BN): RedBN

  /**
   * @description in-place modular multiplication
   */
  redIMul(b: BN): RedBN

  /**
   * @description modular square
   */
  redSqr(): RedBN

  /**
   * @description in-place modular square
   */
  redISqr(): RedBN

  /**
   * @description modular square root
   */
  redSqrt(): RedBN

  /**
   * @description modular inverse of the number
   */
  redInvm(): RedBN

  /**
   * @description modular negation
   */
  redNeg(): RedBN

  /**
   * @description modular exponentiation
   */
  redPow(b: BN): RedBN
}

declare interface SignedTransaction {
  messageHash?: string
  r: string
  s: string
  v: string
  rawTransaction?: string
  transactionHash?: string
}

declare interface Extension {
  property?: string
  methods: Method[]
}

declare interface Providers {
  HttpProvider: new (host: string, options?: HttpProviderOptions) => HttpProvider
  WebsocketProvider: new (host: string, options?: WebsocketProviderOptions) => WebsocketProvider
  IpcProvider: new (path: string, net: any) => IpcProvider
}

declare interface PromiEvent<T> extends Promise<T> {
  once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>

  once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>

  once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>

  once(type: 'error', handler: (error: Error) => void): PromiEvent<T>

  once(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>

  on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>

  on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>

  on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>

  on(type: 'error', handler: (error: Error) => void): PromiEvent<T>

  on(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>
}

declare interface Transaction {
  hash: string
  nonce: number
  blockHash: string | null
  blockNumber: number | null
  transactionIndex: number | null
  from: string
  to: string | null
  value: string
  gasPrice: string
  gas: number
  input: string
}

declare interface TransactionConfig {
  from?: string | number
  to?: string
  value?: number | string | BN
  gas?: number | string
  gasPrice?: number | string | BN
  data?: string
  nonce?: number
  chainId?: number
  common?: Common
  chain?: string
  hardfork?: string
}

declare type chain = 'mainnet' | 'goerli' | 'kovan' | 'rinkeby' | 'ropsten'

declare type hardfork = 'chainstart' | 'homestead' | 'dao' | 'tangerineWhistle' | 'spuriousDragon' | 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul'

declare interface Common {
  customChain: CustomChainParams
  baseChain?: chain
  hardfork?: hardfork
}

declare interface CustomChainParams {
  name?: string
  networkId: number
  chainId: number
}

declare interface RLPEncodedTransaction {
  raw: string
  tx: {
    nonce: string
    gasPrice: string
    gas: string
    to: string
    value: string
    input: string
    r: string
    s: string
    v: string
    hash: string
  }
}

declare interface TransactionReceipt {
  status: boolean
  transactionHash: string
  transactionIndex: number
  blockHash: string
  blockNumber: number
  from: string
  to: string
  contractAddress?: string
  cumulativeGasUsed: number
  gasUsed: number
  logs: Log[]
  logsBloom: string
  events?: {
    [eventName: string]: EventLog
  }
}

declare interface EventLog {
  event: string
  address: string
  returnValues: any
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
  raw?: { data: string; topics: any[] }
}

declare interface Log {
  address: string
  data: string
  topics: string[]
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
}

// had to move `web3-net` due to other modules in `1.x` not referencing

declare class NetworkBase {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  readonly givenProvider: any
  readonly currentProvider: provider
  static readonly givenProvider: any
  static readonly providers: Providers
  BatchRequest: new () => BatchRequest

  setProvider(provider: provider): boolean

  extend(extension: Extension): any

  getNetworkType(callback?: (error: Error, returnValue: string) => void): Promise<string>

  getId(callback?: (error: Error, id: number) => void): Promise<number>

  isListening(callback?: (error: Error, listening: boolean) => void): Promise<boolean>

  getPeerCount(callback?: (error: Error, peerCount: number) => void): Promise<number>
}

// had to move accounts from web3-eth-accounts due to other modules in 1.x not referencing

declare class AccountsBase {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  readonly givenProvider: any
  readonly currentProvider: provider

  setProvider(provider: provider): boolean

  create(entropy?: string): Account

  privateKeyToAccount(privateKey: string): Account

  signTransaction(transactionConfig: TransactionConfig, privateKey: string, callback?: () => void): Promise<SignedTransaction>

  recoverTransaction(signature: string): string

  hashMessage(message: string): string

  sign(data: string, privateKey: string): Sign

  recover(signatureObject: SignatureObject): string
  recover(message: string, signature: string, preFixed?: boolean): string
  recover(message: string, v: string, r: string, s: string, preFixed?: boolean): string

  encrypt(privateKey: string, password: string): EncryptedKeystoreV3Json

  decrypt(keystoreJsonV3: EncryptedKeystoreV3Json, password: string): Account

  wallet: WalletBase
}

declare class WalletBase {
  constructor(accounts: AccountsBase)

  length: number
  defaultKeyName: string;

  [key: number]: Account

  create(numberOfAccounts: number, entropy?: string): WalletBase

  add(account: string | AddAccount): AddedAccount

  remove(account: string | number): boolean

  clear(): WalletBase

  encrypt(password: string): EncryptedKeystoreV3Json[]

  decrypt(keystoreArray: EncryptedKeystoreV3Json[], password: string): WalletBase

  save(password: string, keyName?: string): boolean

  load(password: string, keyName?: string): WalletBase
}

declare interface AddAccount {
  address: string
  privateKey: string
}

declare interface AddedAccount extends Account {
  index: number
}

declare interface Account {
  address: string
  privateKey: string
  signTransaction: (transactionConfig: TransactionConfig, callback?: (signTransaction: SignedTransaction) => void) => Promise<SignedTransaction>
  sign: (data: string) => Sign
  encrypt: (password: string) => EncryptedKeystoreV3Json
}

declare interface EncryptedKeystoreV3Json {
  version: number
  id: string
  address: string
  crypto: {
    ciphertext: string
    cipherparams: { iv: string }
    cipher: string
    kdf: string
    kdfparams: {
      dklen: number
      salt: string
      n: number
      r: number
      p: number
    }
    mac: string
  }
}

declare interface Sign extends SignedTransaction {
  message: string
  signature: string
}

declare interface SignatureObject {
  messageHash: string
  r: string
  s: string
  v: string
}

// put all the `web3-provider` typings in here so we can get to them everywhere as this module does not exist in 1.x

declare class BatchRequest {
  constructor()

  add(method: Method): void

  execute(): void
}

declare class HttpProvider extends HttpProviderBase {
  constructor(host: string, options?: HttpProviderOptions)
}

declare class IpcProvider extends IpcProviderBase {
  constructor(path: string, net: net.Server)
}

declare class WebsocketProvider extends WebsocketProviderBase {
  constructor(host: string, options?: WebsocketProviderOptions)

  isConnecting(): boolean
}

declare interface PastLogsOptions extends LogsOptions {
  toBlock?: BlockNumber
}

declare interface LogsOptions {
  fromBlock?: BlockNumber
  address?: string | string[]
  topics?: Array<string | string[] | null>
}

declare type BlockNumber = string | number | BN | BigNumber | 'latest' | 'pending' | 'earliest'

declare type provider = HttpProvider | IpcProvider | WebsocketProvider | string | null

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

declare class Subscription<T> {
  constructor(options: SubscriptionOptions)

  id: string
  options: SubscriptionOptions
  callback: () => void
  arguments: any

  subscribe(callback?: (error: Error, result: T) => void): Subscription<T>

  unsubscribe(callback?: (error: Error, result: boolean) => void): Promise<undefined | boolean>

  on(type: 'data', handler: (data: T) => void): Subscription<T>

  on(type: 'changed', handler: (data: T) => void): Subscription<T>

  on(type: 'error', handler: (data: Error) => void): Subscription<T>
}

declare class Subscriptions {
  constructor(options: SubscriptionsOptions)

  name: string
  type: string
  subscriptions: SubscriptionsModel
  readonly requestManager: any

  attachToObject(obj: any): void

  setRequestManager(requestManager: any): void

  buildCall(): () => any
}

declare interface SubscriptionOptions {
  subscription: string
  type: string
  requestManager: any
}

declare interface SubscriptionsOptions {
  name: string
  type: string
  subscriptions: SubscriptionsModel
}

declare interface SubscriptionsModel {
  [name: string]: SubscriptionModel
}

declare interface SubscriptionModel {
  subscriptionName: string
  params: number
  outputFormatter: () => void
  inputFormatter: Array<() => void>
  subscriptionHandler: () => void
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare type Unit = 'noether' | 'wei' | 'kwei' | 'Kwei' | 'babbage' | 'femtoether' | 'mwei' | 'Mwei' | 'lovelace' | 'picoether' | 'gwei' | 'Gwei' | 'shannon' | 'nanoether' | 'nano' | 'szabo' | 'microether' | 'micro' | 'finney' | 'milliether' | 'milli' | 'ether' | 'kether' | 'grand' | 'mether' | 'gether' | 'tether'

declare type Mixed =
  | string
  | number
  | BN
  | {
      type: string
      value: string
    }
  | {
      t: string
      v: string | BN | number
    }
  | boolean

declare type Hex = string | number

// utils types
declare function isBN(value: string | number): boolean
declare function isBigNumber(value: BN): boolean
declare function toBN(value: number | string): BN
declare function toTwosComplement(value: number | string | BN): string
declare function isAddress(address: string, chainId?: number): boolean
declare function isHex(hex: Hex): boolean
declare function isHexStrict(hex: Hex): boolean
declare function asciiToHex(string: string, length?: number): string
declare function hexToAscii(string: string): string
declare function toAscii(string: string): string
declare function bytesToHex(bytes: number[]): string
declare function numberToHex(value: number | string | BN): string
declare function checkAddressChecksum(address: string, chainId?: number): boolean
declare function fromAscii(string: string): string
declare function fromDecimal(value: string | number): string
declare function fromUtf8(string: string): string
declare function fromWei(value: string | BN, unit?: Unit): string
declare function hexToBytes(hex: Hex): number[]
declare function hexToNumber(hex: Hex): number
declare function hexToNumberString(hex: Hex): string
declare function hexToString(hex: Hex): string
declare function hexToUtf8(string: string): string
declare function keccak256(value: string | BN): string
declare function padLeft(value: string | number, characterAmount: number, sign?: string): string
declare function leftPad(string: string | number, characterAmount: number, sign?: string): string
declare function rightPad(string: string | number, characterAmount: number, sign?: string): string
declare function padRight(string: string | number, characterAmount: number, sign?: string): string
declare function sha3(value: string | BN): string
declare function randomHex(bytesSize: number): string
declare function utf8ToHex(string: string): string
declare function stringToHex(string: string): string
declare function toChecksumAddress(address: string, chainId?: number): string
declare function toDecimal(hex: Hex): number
declare function toHex(value: number | string | BN): string
declare function toUtf8(string: string): string
declare function toWei(val: BN, unit?: Unit): BN
declare function toWei(val: string, unit?: Unit): string
declare function isBloom(bloom: string): boolean
declare function isInBloom(bloom: string, value: string | Uint8Array): boolean
declare function isUserEthereumAddressInBloom(bloom: string, ethereumAddress: string): boolean
declare function isContractAddressInBloom(bloom: string, contractAddress: string): boolean
declare function isTopicInBloom(bloom: string, topic: string): boolean
declare function isTopic(topic: string): boolean
declare function jsonInterfaceMethodToString(abiItem: AbiItem): string
declare function soliditySha3(...val: Mixed[]): string
declare function getUnitValue(unit: Unit): string
declare function unitMap(): Units
declare function testAddress(bloom: string, address: string): boolean
declare function testTopic(bloom: string, topic: string): boolean
declare function getSignatureParameters(signature: string): { r: string; s: string; v: number }
declare function stripHexPrefix(str: string): string

// interfaces
declare interface Utils {
  isBN(value: string | number): boolean
  isBigNumber(value: BN): boolean
  toBN(value: number | string): BN
  toTwosComplement(value: number | string | BN): string
  isAddress(address: string, chainId?: number): boolean
  isHex(hex: Hex): boolean
  isHexStrict(hex: Hex): boolean
  asciiToHex(string: string, length?: number): string
  hexToAscii(string: string): string
  toAscii(string: string): string
  bytesToHex(bytes: number[]): string
  numberToHex(value: number | string | BN): string
  checkAddressChecksum(address: string, chainId?: number): boolean
  fromAscii(string: string): string
  fromDecimal(value: string | number): string
  fromUtf8(string: string): string
  fromWei(value: string | BN, unit?: Unit): string
  hexToBytes(hex: Hex): number[]
  hexToNumber(hex: Hex): number
  hexToNumberString(hex: Hex): string
  hexToString(hex: Hex): string
  hexToUtf8(string: string): string
  keccak256(value: string | BN): string
  padLeft(value: string | number, characterAmount: number, sign?: string): string
  leftPad(string: string | number, characterAmount: number, sign?: string): string
  rightPad(string: string | number, characterAmount: number, sign?: string): string
  padRight(string: string | number, characterAmount: number, sign?: string): string
  sha3(value: string | BN): string
  randomHex(bytesSize: number): string
  utf8ToHex(string: string): string
  stringToHex(string: string): string
  toChecksumAddress(address: string, chainId?: number): string
  toDecimal(hex: Hex): number
  toHex(value: number | string | BN): string
  toUtf8(string: string): string
  toWei(val: BN, unit?: Unit): BN
  toWei(val: string, unit?: Unit): string
  isBloom(bloom: string): boolean
  isInBloom(bloom: string, value: string | Uint8Array): boolean
  isUserEthereumAddressInBloom(bloom: string, ethereumAddress: string): boolean
  isContractAddressInBloom(bloom: string, contractAddress: string): boolean
  isTopicInBloom(bloom: string, topic: string): boolean
  isTopic(topic: string): boolean
  jsonInterfaceMethodToString(abiItem: AbiItem): string
  soliditySha3(...val: Mixed[]): string
  getUnitValue(unit: Unit): string
  unitMap(): Units
  testAddress(bloom: string, address: string): boolean
  testTopic(bloom: string, topic: string): boolean
  getSignatureParameters(signature: string): { r: string; s: string; v: number }
  stripHexPrefix(str: string): string
}

declare interface Units {
  noether: string
  wei: string
  kwei: string
  Kwei: string
  babbage: string
  femtoether: string
  mwei: string
  Mwei: string
  lovelace: string
  picoether: string
  gwei: string
  Gwei: string
  shannon: string
  nanoether: string
  nano: string
  szabo: string
  microether: string
  micro: string
  finney: string
  milliether: string
  milli: string
  ether: string
  kether: string
  grand: string
  mether: string
  gether: string
  tether: string
}

declare type AbiType = 'function' | 'constructor' | 'event' | 'fallback'
declare type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable'

declare interface AbiItem {
  anonymous?: boolean
  constant?: boolean
  inputs?: AbiInput[]
  name?: string
  outputs?: AbiOutput[]
  payable?: boolean
  stateMutability?: StateMutabilityType
  type: AbiType
}

declare interface AbiInput {
  name: string
  type: string
  indexed?: boolean
  components?: AbiInput[]
}

declare interface AbiOutput {
  name: string
  type: string
  components?: AbiOutput[]
  internalType?: string
}

declare class AbiCoder {
  encodeFunctionSignature(functionName: string | AbiItem): string

  encodeEventSignature(functionName: string | AbiItem): string

  encodeParameter(type: any, parameter: any): string

  encodeParameters(types: any[], paramaters: any[]): string

  encodeFunctionCall(abiItem: AbiItem, params: string[]): string

  decodeParameter(type: any, hex: string): { [key: string]: any }

  decodeParameters(types: any[], hex: string): { [key: string]: any }

  decodeLog(inputs: AbiInput[], hex: string, topics: string[]): { [key: string]: string }
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

declare class Accounts extends AccountsBase {}

declare class Wallet extends WalletBase {}

declare interface Sign extends SignedTransaction {
  message: string
  signature: string
}

declare interface SignatureObject {
  messageHash: string
  r: string
  s: string
  v: string
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Contract {
  constructor(jsonInterface: AbiItem[], address?: string, options?: ContractOptions)

  private _address: string
  private _jsonInterface: AbiItem[]
  defaultAccount: string | null
  defaultBlock: string | number
  defaultCommon: Common
  defaultHardfork: hardfork
  defaultChain: chain
  transactionPollingTimeout: number
  transactionConfirmationBlocks: number
  transactionBlockTimeout: number

  options: Options

  clone(): Contract

  deploy(options: DeployOptions): ContractSendMethod

  contractMethods

  once(event: string, callback: (error: Error, event: EventData) => void): void
  once(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): void

  events: any

  getPastEvents(event: string): Promise<EventData[]>
  getPastEvents(event: string, options: PastEventOptions, callback: (error: Error, event: EventData) => void): Promise<EventData[]>
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>
  getPastEvents(event: string, callback: (error: Error, event: EventData) => void): Promise<EventData[]>
}

declare interface Options extends ContractOptions {
  address: string
  jsonInterface: AbiItem[]
}

declare interface DeployOptions {
  data: string
  arguments?: any[]
}

declare interface ContractSendMethod {
  send(options: SendOptions, callback?: (err: Error, transactionHash: string) => void): PromiEvent<Contract>

  estimateGas(options: EstimateGasOptions, callback?: (err: Error, gas: number) => void): Promise<number>

  estimateGas(callback: (err: Error, gas: number) => void): Promise<number>

  estimateGas(options: EstimateGasOptions, callback: (err: Error, gas: number) => void): Promise<number>

  estimateGas(options: EstimateGasOptions): Promise<number>

  estimateGas(): Promise<number>

  encodeABI(): string
}

declare interface SendOptions {
  from: string
  gasPrice?: string
  gas?: number
  value?: number | string | BN
}

declare interface EstimateGasOptions {
  from?: string
  gas?: number
  value?: number | string | BN
}

declare interface ContractOptions {
  // Sender to use for contract calls
  from?: string
  // Gas price to use for contract calls
  gasPrice?: string
  // Gas to use for contract calls
  gas?: number
  // Contract code
  data?: string
}

declare interface PastEventOptions extends PastLogsOptions {
  filter?: Filter
}

declare interface EventOptions extends LogsOptions {
  filter?: Filter
}

declare interface Filter {
  [key: string]: number | string | string[] | number[]
}

declare interface EventData {
  returnValues: {
    [key: string]: any
  }
  raw: {
    data: string
    topics: string[]
  }
  event: string
  signature: string
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
  address: string
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>, Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Ens {
  constructor(eth: Eth)

  registry: Registry

  resolver(name: string): Promise<Contract>

  supportsInterface(name: string, interfaceId: string, callback?: (error: Error, supportsInterface: boolean) => void): Promise<boolean>

  getAddress(name: string, callback?: (error: Error, address: string) => void): Promise<string>

  setAddress(name: string, address: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>

  getPubkey(name: string, callback?: (error: Error, result: { [x: string]: string }) => void): Promise<{ [x: string]: string }>

  setPubkey(name: string, x: string, y: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>

  getText(name: string, key: string, callback?: (error: Error, ensName: string) => void): Promise<string>

  setText(name: string, key: string, value: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>

  getContent(name: string, callback?: (error: Error, contentHash: string) => void): Promise<string>

  setContent(name: string, hash: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>

  getMultihash(name: string, callback?: (error: Error, multihash: string) => void): Promise<string>

  setMultihash(name: string, hash: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>

  getContenthash(name: string, callback?: (error: Error, contenthash: string) => void): Promise<string>

  setContenthash(name: string, hash: string, sendOptions: TransactionConfig, callback?: (error: Error, result: any) => void): PromiEvent<any>
}

declare class Registry {
  constructor(ens: Ens)

  ens: Ens

  contract: Contract | null

  owner(name: string, callback?: (error: Error, address: string) => void): Promise<string>

  resolver(name: string): Promise<Contract>
}

/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Iban {
  constructor(iban: string)

  static toAddress(iban: string): string

  static toIban(address: string): string

  static fromAddress(address: string): Iban

  static fromBban(bban: string): Iban

  static createIndirect(options: IndirectOptions): Iban

  static isValid(iban: string): boolean

  isValid(): boolean

  isDirect(): boolean

  isIndirect(): boolean

  checksum(): string

  institution(): string

  client(): string

  toAddress(): string

  toString(): string
}

declare interface IndirectOptions {
  institution: string
  identifier: string
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Huan Zhang <huanzhang30@gmail.com>,
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Personal {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  readonly givenProvider: any
  static readonly givenProvider: any
  static readonly providers: Providers
  readonly currentProvider: provider
  defaultAccount: string | null
  defaultBlock: string | number
  BatchRequest: new () => BatchRequest

  setProvider(provider: provider): boolean

  extend(extension: Extension): any

  newAccount(password: string, callback?: (error: Error, address: string) => void): Promise<string>

  sign(dataToSign: string, address: string, password: string, callback?: (error: Error, signature: string) => void): Promise<string>

  ecRecover(dataThatWasSigned: string, signature: string, callback?: (error: Error, address: string) => void): Promise<string>

  signTransaction(transactionConfig: TransactionConfig, password: string, callback?: (error: Error, RLPEncodedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>

  sendTransaction(transactionConfig: TransactionConfig, password: string, callback?: (error: Error, transactionHash: string) => void): Promise<string>

  unlockAccount(address: string, password: string, unlockDuration: number, callback?: (error: Error) => void): Promise<boolean>

  lockAccount(address: string, callback?: (error: Error, success: boolean) => void): Promise<boolean>

  getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]>

  importRawKey(privateKey: string, password: string, callback?: (error: Error, result: string) => void): Promise<string>
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

declare class Network extends NetworkBase {}

declare class Eth {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  Contract: new (jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions) => Contract
  Iban: new (iban: string) => Iban
  personal: Personal
  accounts: Accounts
  ens: Ens
  abi: AbiCoder
  net: Network

  readonly givenProvider: any
  static readonly givenProvider: any
  defaultAccount: string | null
  defaultBlock: string | number
  defaultCommon: Common
  defaultHardfork: hardfork
  defaultChain: chain
  transactionPollingTimeout: number
  transactionConfirmationBlocks: number
  transactionBlockTimeout: number
  readonly currentProvider: provider
  setProvider(provider: provider): boolean
  BatchRequest: new () => BatchRequest
  static readonly providers: Providers
  extend(extension: Extension): any

  clearSubscriptions(callback: (error: Error, result: boolean) => void): void

  subscribe(type: 'logs', options: LogsOptions, callback?: (error: Error, log: Log) => void): Subscription<Log>
  subscribe(type: 'syncing', callback?: (error: Error, result: Syncing) => void): Subscription<Syncing>
  subscribe(type: 'newBlockHeaders', callback?: (error: Error, blockHeader: BlockHeader) => void): Subscription<BlockHeader>
  subscribe(type: 'pendingTransactions', callback?: (error: Error, transactionHash: string) => void): Subscription<string>

  getProtocolVersion(callback?: (error: Error, protocolVersion: string) => void): Promise<string>

  isSyncing(callback?: (error: Error, syncing: Syncing) => void): Promise<Syncing | boolean>

  getCoinbase(callback?: (error: Error, coinbaseAddress: string) => void): Promise<string>

  isMining(callback?: (error: Error, mining: boolean) => void): Promise<boolean>

  getHashrate(callback?: (error: Error, hashes: number) => void): Promise<number>

  getNodeInfo(callback?: (error: Error, version: string) => void): Promise<string>

  getChainId(callback?: (error: Error, version: number) => void): Promise<number>

  getGasPrice(callback?: (error: Error, gasPrice: string) => void): Promise<string>

  getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]>

  getBlockNumber(callback?: (error: Error, blockNumber: number) => void): Promise<number>

  getBalance(address: string): Promise<string>
  getBalance(address: string, defaultBlock: BlockNumber): Promise<string>
  getBalance(address: string, callback?: (error: Error, balance: string) => void): Promise<string>
  getBalance(address: string, defaultBlock: BlockNumber, callback?: (error: Error, balance: string) => void): Promise<string>

  getStorageAt(address: string, position: number | BigNumber | BN | string): Promise<string>
  getStorageAt(address: string, position: number | BigNumber | BN | string, defaultBlock: BlockNumber): Promise<string>
  getStorageAt(address: string, position: number | BigNumber | BN | string, callback?: (error: Error, storageAt: string) => void): Promise<string>
  getStorageAt(address: string, position: number | BigNumber | BN | string, defaultBlock: BlockNumber, callback?: (error: Error, storageAt: string) => void): Promise<string>

  getCode(address: string): Promise<string>
  getCode(address: string, defaultBlock: BlockNumber): Promise<string>
  getCode(address: string, callback?: (error: Error, code: string) => void): Promise<string>
  getCode(address: string, defaultBlock: BlockNumber, callback?: (error: Error, code: string) => void): Promise<string>

  getBlock(blockHashOrBlockNumber: BlockNumber | string): Promise<BlockTransactionString>
  getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: true): Promise<BlockTransactionObject>
  getBlock(blockHashOrBlockNumber: BlockNumber | string, callback?: (error: Error, block: BlockTransactionString) => void): Promise<BlockTransactionString>
  getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: true, callback?: (error: Error, block: BlockTransactionObject) => void): Promise<BlockTransactionObject>

  getBlockTransactionCount(blockHashOrBlockNumber: BlockNumber | string, callback?: (error: Error, numberOfTransactions: number) => void): Promise<number>

  getBlockUncleCount(blockHashOrBlockNumber: BlockNumber | string, callback?: (error: Error, numberOfTransactions: number) => void): Promise<number>

  getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BN): Promise<BlockTransactionString>
  getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BN, returnTransactionObjects: true): Promise<BlockTransactionObject>
  getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BN, callback?: (error: Error, uncle: any) => void): Promise<BlockTransactionString>
  getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BN, returnTransactionObjects: true, callback?: (error: Error, uncle: any) => void): Promise<BlockTransactionObject>

  getTransaction(transactionHash: string, callback?: (error: Error, transaction: Transaction) => void): Promise<Transaction>

  getPendingTransactions(callback?: (error: Error, result: Transaction[]) => void): Promise<Transaction[]>

  getTransactionFromBlock(blockHashOrBlockNumber: BlockNumber | string, indexNumber: number | string | BN, callback?: (error: Error, transaction: Transaction) => void): Promise<Transaction>

  getTransactionReceipt(hash: string, callback?: (error: Error, transactionReceipt: TransactionReceipt) => void): Promise<TransactionReceipt>

  getTransactionCount(address: string): Promise<number>
  getTransactionCount(address: string, defaultBlock: BlockNumber): Promise<number>
  getTransactionCount(address: string, callback?: (error: Error, count: number) => void): Promise<number>
  getTransactionCount(address: string, defaultBlock: BlockNumber, callback?: (error: Error, count: number) => void): Promise<number>

  sendTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>

  sendSignedTransaction(signedTransactionData: string, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>

  sign(dataToSign: string, address: string | number, callback?: (error: Error, signature: string) => void): Promise<string>

  signTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>
  signTransaction(transactionConfig: TransactionConfig, address: string): Promise<RLPEncodedTransaction>
  signTransaction(transactionConfig: TransactionConfig, address: string, callback: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>

  call(transactionConfig: TransactionConfig): Promise<string>
  call(transactionConfig: TransactionConfig, defaultBlock?: BlockNumber): Promise<string>
  call(transactionConfig: TransactionConfig, callback?: (error: Error, data: string) => void): Promise<string>
  call(transactionConfig: TransactionConfig, defaultBlock: BlockNumber, callback: (error: Error, data: string) => void): Promise<string>

  estimateGas(transactionConfig: TransactionConfig, callback?: (error: Error, gas: number) => void): Promise<number>

  getPastLogs(options: PastLogsOptions, callback?: (error: Error, logs: Log[]) => void): Promise<Log[]>

  getWork(callback?: (error: Error, result: string[]) => void): Promise<string[]>

  submitWork(data: [string, string, string], callback?: (error: Error, result: boolean) => void): Promise<boolean>

  getProof(address: string, storageKey: string[], blockNumber: BlockNumber, callback?: (error: Error, result: GetProof) => void): Promise<GetProof>
}

declare interface Syncing {
  StartingBlock: number
  CurrentBlock: number
  HighestBlock: number
  KnownStates: number
  PulledStates: number
}

declare interface BlockHeader {
  number: number
  hash: string
  parentHash: string
  nonce: string
  sha3Uncles: string
  logsBloom: string
  transactionRoot: string
  stateRoot: string
  receiptRoot: string
  miner: string
  extraData: string
  gasLimit: number
  gasUsed: number
  timestamp: number | string
}

// TODO: This interface does exist to provide backwards-compatibility and can get removed on a minor release
declare interface Block extends BlockTransactionBase {
  transactions: Transaction[] | string[]
}

declare interface BlockTransactionBase extends BlockHeader {
  size: number
  difficulty: number
  totalDifficulty: number
  uncles: string[]
}

declare interface BlockTransactionObject extends BlockTransactionBase {
  transactions: Transaction[]
}

declare interface BlockTransactionString extends BlockTransactionBase {
  transactions: string[]
}

declare interface GetProof {
  jsonrpc: string
  id: number
  result: {
    address: string
    accountProof: string[]
    balance: string
    codeHash: string
    nonce: string
    storageHash: string
    storageProof: StorageProof[]
  }
}

declare interface StorageProof {
  key: string
  value: string
  proof: string[]
}

/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

declare class Shh {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  readonly givenProvider: any
  static readonly givenProvider: any
  static readonly providers: Providers
  readonly currentProvider: provider
  BatchRequest: new () => BatchRequest

  setProvider(provider: provider): boolean

  extend(extension: Extension): any

  net: Network

  getVersion(callback?: (error: Error, version: string) => void): Promise<string>

  getInfo(callback?: (error: Error, info: Info) => void): Promise<Info>

  setMaxMessageSize(size: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  setMinPoW(pow: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  markTrustedPeer(enode: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  newKeyPair(callback?: (error: Error, key: string) => void): Promise<string>

  addPrivateKey(privateKey: string, callback?: (error: Error, privateKey: string) => void): Promise<string>

  deleteKeyPair(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  hasKeyPair(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  getPublicKey(id: string, callback?: (error: Error, publicKey: string) => void): Promise<string>

  getPrivateKey(id: string, callback?: (error: Error, privateKey: string) => void): Promise<string>

  newSymKey(callback?: (error: Error, key: string) => void): Promise<string>

  addSymKey(symKey: string, callback?: (error: Error, key: string) => void): Promise<string>

  generateSymKeyFromPassword(password: string, callback?: (error: Error, key: string) => void): Promise<string>

  hasSymKey(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  getSymKey(id: string, callback?: (error: Error, key: string) => void): Promise<string>

  deleteSymKey(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

  post(object: PostWithSymKey | PostWithPubKey, callback?: (error: Error, result: string) => void): Promise<string>

  subscribe(string: 'messages', options: SubscriptionOptions, callback?: (error: Error, message: Notification, subscription: any) => void): Subscribe

  newMessageFilter(options?: SubscriptionOptions, callback?: (error: Error, result: string) => void): Promise<string>

  deleteMessageFilter(id: string, callback?: (error: Error, result: string) => void): Promise<boolean>

  getFilterMessages(id: string, callback?: (error: Error, result: string) => void): Promise<Notification[]>
}

declare interface Info {
  messages: number
  maxMessageSize: number
  memory: number
  minPow: number
}

declare interface PostBase {
  sig?: string
  ttl: number
  topic: string
  payload: string
  padding?: number
  powTime?: number
  powTarget?: number
  targetPeer?: number
}

declare interface PostWithSymKey extends PostBase {
  symKeyID: string
}

declare interface PostWithPubKey extends PostBase {
  pubKey: string
}

declare interface SubscriptionOptions {
  symKeyID?: string
  privateKeyID?: string
  sig?: string
  topics?: string[]
  minPow?: number
  allowP2P?: boolean
  ttl?: number
}

declare interface Notification {
  hash: string
  sig?: string
  recipientPublicKey?: string
  timestamp: string
  ttl: number
  topic: string
  payload: string
  padding: number
  pow: number
}

declare interface Subscribe {
  on(type: 'data', handler: (data: Notification) => void): void

  on(type: 'error', handler: (data: Error) => void): void
}

declare class Web3 {
  constructor()
  constructor(provider: provider)
  constructor(provider: provider, net: net.Socket)

  static modules: Modules
  readonly givenProvider: any
  static readonly givenProvider: any
  defaultAccount: string | null
  defaultBlock: string | number
  readonly currentProvider: provider
  setProvider(provider: provider): boolean
  BatchRequest: new () => BatchRequest
  static readonly providers: Providers

  utils: Utils
  eth: Eth
  shh: Shh
  bzz: Bzz
  version: string
  static readonly version: string
  static readonly utils: Utils
  extend(extension: Extension): any
}

declare interface Modules {
  Eth: new (provider: provider, net: net.Socket) => Eth
  Net: new (provider: provider, net: net.Socket) => Network
  Personal: new (provider: provider, net: net.Socket) => Personal
  Shh: new (provider: provider, net: net.Socket) => Shh
  Bzz: new (provider: provider) => Bzz
}

declare var web3: Web3
