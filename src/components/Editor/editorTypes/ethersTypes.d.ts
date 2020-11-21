

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

/**
 *  getNetwork
 *
 *  Converts a named common networks or chain ID (network ID) to a Network
 *  and verifies a network is a valid Network..
 */
declare function getNetwork(network: Networkish): Network

declare function defineReadOnly<T, K extends keyof T>(object: T, name: K, value: T[K]): void
declare function getStatic<T>(ctor: any, key: string): T
declare type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>
}
declare function resolveProperties<T>(object: Readonly<Deferrable<T>>): Promise<T>
declare function checkProperties(
  object: any,
  properties: {
    [name: string]: boolean
  }
): void
declare function shallowCopy<T>(object: T): T
declare function deepCopy<T>(object: T): T
declare class Description<T = any> {
  constructor(
    info: {
      [K in keyof T]: T[K]
    }
  )
}

declare type UnsignedTransaction = {
  to?: string
  nonce?: number
  gasLimit?: BigNumberish
  gasPrice?: BigNumberish
  data?: BytesLike
  value?: BigNumberish
  chainId?: number
}
declare interface Transaction {
  hash?: string
  to?: string
  from?: string
  nonce: number
  gasLimit: BigNumber
  gasPrice: BigNumber
  data: string
  value: BigNumber
  chainId: number
  r?: string
  s?: string
  v?: number
}
declare function computeAddress(key: BytesLike | string): string
declare function recoverAddress(digest: BytesLike, signature: SignatureLike): string
declare function serialize(transaction: UnsignedTransaction, signature?: SignatureLike): string
declare function parse(rawTransaction: BytesLike): Transaction

declare type ConnectionInfo = {
  url: string
  user?: string
  password?: string
  allowInsecureAuthentication?: boolean
  throttleLimit?: number
  timeout?: number
  headers?: {
    [key: string]: string | number
  }
}
declare interface OnceBlockable {
  once(eventName: 'block', handler: () => void): void
}
declare interface OncePollable {
  once(eventName: 'poll', handler: () => void): void
}
declare type PollOptions = {
  timeout?: number
  floor?: number
  ceiling?: number
  interval?: number
  retryLimit?: number
  onceBlock?: OnceBlockable
  oncePoll?: OncePollable
}
declare type FetchJsonResponse = {
  statusCode: number
  headers: {
    [header: string]: string
  }
}
declare function fetchJson(connection: string | ConnectionInfo, json?: string, processFunc?: (value: any, response: FetchJsonResponse) => any): Promise<any>
declare function poll<T>(func: () => Promise<T>, options?: PollOptions): Promise<T>

declare type TransactionRequest = {
  to?: string
  from?: string
  nonce?: BigNumberish
  gasLimit?: BigNumberish
  gasPrice?: BigNumberish
  data?: BytesLike
  value?: BigNumberish
  chainId?: number
}
declare interface TransactionResponse extends Transaction {
  hash: string
  blockNumber?: number
  blockHash?: string
  timestamp?: number
  confirmations: number
  from: string
  raw?: string
  wait: (confirmations?: number) => Promise<TransactionReceipt>
}
declare type BlockTag = string | number
interface _Block {
  hash: string
  parentHash: string
  number: number
  timestamp: number
  nonce: string
  difficulty: number
  gasLimit: BigNumber
  gasUsed: BigNumber
  miner: string
  extraData: string
}
declare interface Block extends _Block {
  transactions: Array<string>
}
declare interface BlockWithTransactions extends _Block {
  transactions: Array<TransactionResponse>
}
declare interface Log {
  blockNumber: number
  blockHash: string
  transactionIndex: number
  removed: boolean
  address: string
  data: string
  topics: Array<string>
  transactionHash: string
  logIndex: number
}
declare interface TransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  root?: string
  gasUsed: BigNumber
  logsBloom: string
  blockHash: string
  transactionHash: string
  logs: Array<Log>
  blockNumber: number
  confirmations: number
  cumulativeGasUsed: BigNumber
  byzantium: boolean
  status?: number
}
declare interface EventFilter {
  address?: string
  topics?: Array<string | Array<string>>
}
declare interface Filter extends EventFilter {
  fromBlock?: BlockTag
  toBlock?: BlockTag
}
declare interface FilterByBlockHash extends EventFilter {
  blockHash?: string
}
declare abstract class ForkEvent extends Description {
  readonly expiry: number
  readonly _isForkEvent?: boolean
  static isForkEvent(value: any): value is ForkEvent
}
declare class BlockForkEvent extends ForkEvent {
  readonly blockHash: string
  readonly _isBlockForkEvent?: boolean
  constructor(blockHash: string, expiry?: number)
}
declare class TransactionForkEvent extends ForkEvent {
  readonly hash: string
  readonly _isTransactionOrderForkEvent?: boolean
  constructor(hash: string, expiry?: number)
}
declare class TransactionOrderForkEvent extends ForkEvent {
  readonly beforeHash: string
  readonly afterHash: string
  constructor(beforeHash: string, afterHash: string, expiry?: number)
}
declare type EventType = string | Array<string | Array<string>> | EventFilter | ForkEvent
declare type Listener = (...args: Array<any>) => void
declare abstract class Provider implements OnceBlockable {
  abstract getNetwork(): Promise<Network>
  abstract getBlockNumber(): Promise<number>
  abstract getGasPrice(): Promise<BigNumber>
  abstract getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>
  abstract getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>
  abstract getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>
  abstract getStorageAt(addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>
  abstract sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>
  abstract call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>
  abstract estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber>
  abstract getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>
  abstract getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions>
  abstract getTransaction(transactionHash: string): Promise<TransactionResponse>
  abstract getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>
  abstract getLogs(filter: Filter): Promise<Array<Log>>
  abstract resolveName(name: string | Promise<string>): Promise<string>
  abstract lookupAddress(address: string | Promise<string>): Promise<string>
  abstract on(eventName: EventType, listener: Listener): Provider
  abstract once(eventName: EventType, listener: Listener): Provider
  abstract emit(eventName: EventType, ...args: Array<any>): boolean
  abstract listenerCount(eventName?: EventType): number
  abstract listeners(eventName?: EventType): Array<Listener>
  abstract off(eventName: EventType, listener?: Listener): Provider
  abstract removeAllListeners(eventName?: EventType): Provider
  addListener(eventName: EventType, listener: Listener): Provider
  removeListener(eventName: EventType, listener: Listener): Provider
  abstract waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>
  readonly _isProvider: boolean
  constructor()
  static isProvider(value: any): value is Provider
}

declare interface ExternallyOwnedAccount {
  readonly address: string
  readonly privateKey: string
}
declare abstract class Signer {
  readonly provider?: Provider
  abstract getAddress(): Promise<string>
  abstract signMessage(message: Bytes | string): Promise<string>
  abstract signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>
  abstract connect(provider: Provider): Signer
  readonly _isSigner: boolean
  constructor()
  getBalance(blockTag?: BlockTag): Promise<BigNumber>
  getTransactionCount(blockTag?: BlockTag): Promise<number>
  estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber>
  call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag): Promise<string>
  sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse>
  getChainId(): Promise<number>
  getGasPrice(): Promise<BigNumber>
  resolveName(name: string): Promise<string>
  checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest>
  populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest>
  _checkProvider(operation?: string): void
  static isSigner(value: any): value is Signer
}
declare class VoidSigner extends Signer {
  readonly address: string
  constructor(address: string, provider?: Provider)
  getAddress(): Promise<string>
  _fail(message: string, operation: string): Promise<any>
  signMessage(message: Bytes | string): Promise<string>
  signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>
  connect(provider: Provider): VoidSigner
}

declare interface Overrides {
  gasLimit?: BigNumberish | Promise<BigNumberish>
  gasPrice?: BigNumberish | Promise<BigNumberish>
  nonce?: BigNumberish | Promise<BigNumberish>
}
declare interface PayableOverrides extends Overrides {
  value?: BigNumberish | Promise<BigNumberish>
}
declare interface CallOverrides extends PayableOverrides {
  blockTag?: BlockTag | Promise<BlockTag>
  from?: string | Promise<string>
}
declare interface PopulatedTransaction {
  to?: string
  from?: string
  nonce?: number
  gasLimit?: BigNumber
  gasPrice?: BigNumber
  data?: string
  value?: BigNumber
  chainId?: number
}
declare type EventFilter = {
  address?: string
  topics?: Array<string | Array<string>>
}
declare type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>
declare interface Event extends Log {
  event?: string
  eventSignature?: string
  args?: Result
  decodeError?: Error
  decode?: (data: string, topics?: Array<string>) => any
  removeListener: () => void
  getBlock: () => Promise<Block>
  getTransaction: () => Promise<TransactionResponse>
  getTransactionReceipt: () => Promise<TransactionReceipt>
}
declare interface ContractReceipt extends TransactionReceipt {
  events?: Array<Event>
}
declare interface ContractTransaction extends TransactionResponse {
  wait(confirmations?: number): Promise<ContractReceipt>
}
declare class RunningEvent {
  readonly tag: string
  readonly filter: EventFilter
  private _listeners
  constructor(tag: string, filter: EventFilter)
  addListener(listener: Listener, once: boolean): void
  removeListener(listener: Listener): void
  removeAllListeners(): void
  listeners(): Array<Listener>
  listenerCount(): number
  run(args: Array<any>): number
  prepareEvent(event: Event): void
  getEmit(event: Event): Array<any>
}
declare type ContractInterface = string | Array<Fragment | JsonFragment | string> | Interface

declare class Contract {
  readonly address: string
  readonly interface: Interface
  readonly signer: Signer
  readonly provider: Provider
  readonly functions: {
    [name: string]: ContractFunction
  }
  readonly callStatic: {
    [name: string]: ContractFunction
  }
  readonly estimateGas: {
    [name: string]: ContractFunction<BigNumber>
  }
  readonly populateTransaction: {
    [name: string]: ContractFunction<PopulatedTransaction>
  }
  readonly filters: {
    [name: string]: (...args: Array<any>) => EventFilter
  }
  readonly [key: string]: ContractFunction | any
  readonly resolvedAddress: Promise<string>
  readonly deployTransaction: TransactionResponse
  _deployedPromise: Promise<Contract>
  _runningEvents: {
    [eventTag: string]: RunningEvent
  }
  _wrappedEmits: {
    [eventTag: string]: (...args: Array<any>) => void
  }
  constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider?: Signer | Provider)
  static getContractAddress(transaction: { from: string; nonce: BigNumberish }): string
  static getInterface(contractInterface: ContractInterface): Interface
  deployed(): Promise<Contract>
  _deployed(blockTag?: BlockTag): Promise<Contract>
  fallback(overrides?: TransactionRequest): Promise<TransactionResponse>
  connect(signerOrProvider: Signer | Provider | string): Contract
  attach(addressOrName: string): Contract
  static isIndexed(value: any): value is Indexed
  private _normalizeRunningEvent
  private _getRunningEvent
  _checkRunningEvents(runningEvent: RunningEvent): void
  _wrapEvent(runningEvent: RunningEvent, log: Log, listener: Listener): Event
  private _addEventListener
  queryFilter(event: EventFilter, fromBlockOrBlockhash?: BlockTag | string, toBlock?: BlockTag): Promise<Array<Event>>
  on(event: EventFilter | string, listener: Listener): this
  once(event: EventFilter | string, listener: Listener): this
  emit(eventName: EventFilter | string, ...args: Array<any>): boolean
  listenerCount(eventName?: EventFilter | string): number
  listeners(eventName?: EventFilter | string): Array<Listener>
  removeAllListeners(eventName?: EventFilter | string): this
  off(eventName: EventFilter | string, listener: Listener): this
  removeListener(eventName: EventFilter | string, listener: Listener): this
}
declare class ContractFactory {
  readonly interface: Interface
  readonly bytecode: string
  readonly signer: Signer
  constructor(
    contractInterface: ContractInterface,
    bytecode:
      | BytesLike
      | {
        object: string
      },
    signer?: Signer
  )
  getDeployTransaction(...args: Array<any>): TransactionRequest
  deploy(...args: Array<any>): Promise<Contract>
  attach(address: string): Contract
  connect(signer: Signer): ContractFactory
  static fromSolidity(compilerOutput: any, signer?: Signer): ContractFactory
  static getInterface(contractInterface: ContractInterface): Interface
  static getContractAddress(tx: { from: string; nonce: BytesLike | BigNumber | number }): string
  static getContract(address: string, contractInterface: ContractInterface, signer?: Signer): Contract
}

declare const wordlists: {
  [locale: string]: Wordlist
}

declare const defaultPath = "m/44'/60'/0'/0/0"
declare interface Mnemonic {
  readonly phrase: string
  readonly path: string
  readonly locale: string
}
declare class HDNode implements ExternallyOwnedAccount {
  readonly privateKey: string
  readonly publicKey: string
  readonly fingerprint: string
  readonly parentFingerprint: string
  readonly address: string
  readonly mnemonic?: Mnemonic
  readonly path: string
  readonly chainCode: string
  readonly index: number
  readonly depth: number
  /**
   *  This constructor should not be called directly.
   *
   *  Please use:
   *   - fromMnemonic
   *   - fromSeed
   */
  constructor(constructorGuard: any, privateKey: string, publicKey: string, parentFingerprint: string, chainCode: string, index: number, depth: number, mnemonicOrPath: Mnemonic | string)
  get extendedKey(): string
  neuter(): HDNode
  private _derive
  derivePath(path: string): HDNode
  static _fromSeed(seed: BytesLike, mnemonic: Mnemonic): HDNode
  static fromMnemonic(mnemonic: string, password?: string, wordlist?: string | Wordlist): HDNode
  static fromSeed(seed: BytesLike): HDNode
  static fromExtendedKey(extendedKey: string): HDNode
}
declare function mnemonicToSeed(mnemonic: string, password?: string): string
declare function mnemonicToEntropy(mnemonic: string, wordlist?: string | Wordlist): string
declare function entropyToMnemonic(entropy: BytesLike, wordlist?: string | Wordlist): string
declare function isValidMnemonic(mnemonic: string, wordlist?: Wordlist): boolean

declare class SigningKey {
  readonly curve: string
  readonly privateKey: string
  readonly publicKey: string
  readonly compressedPublicKey: string
  readonly _isSigningKey: boolean
  constructor(privateKey: BytesLike)
  _addPoint(other: BytesLike): string
  signDigest(digest: BytesLike): Signature
  computeSharedSecret(otherKey: BytesLike): string
  static isSigningKey(value: any): value is SigningKey
}
declare function recoverPublicKey(digest: BytesLike, signature: SignatureLike): string
declare function computePublicKey(key: BytesLike, compressed?: boolean): string

declare function decryptJsonWallet(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<ExternallyOwnedAccount>
declare function decryptJsonWalletSync(json: string, password: Bytes | string): ExternallyOwnedAccount

declare class Wallet extends Signer implements ExternallyOwnedAccount {
  readonly address: string
  readonly provider: Provider
  readonly _signingKey: () => SigningKey
  readonly _mnemonic: () => Mnemonic
  constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider)
  get mnemonic(): Mnemonic
  get privateKey(): string
  get publicKey(): string
  getAddress(): Promise<string>
  connect(provider: Provider): Wallet
  signTransaction(transaction: TransactionRequest): Promise<string>
  signMessage(message: Bytes | string): Promise<string>
  encrypt(password: Bytes | string, options?: any, progressCallback?: ProgressCallback): Promise<string>
  /**
   *  Static methods to create Wallet instances.
   */
  static createRandom(options?: any): Wallet
  static fromEncryptedJson(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<Wallet>
  static fromEncryptedJsonSync(json: string, password: Bytes | string): Wallet
  static fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet
}
declare function verifyMessage(message: Bytes | string, signature: SignatureLike): string

declare const AddressZero = '0x0000000000000000000000000000000000000000'
declare const HashZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
declare const EtherSymbol = '\u039E'
declare const NegativeOne: BigNumber
declare const Zero: BigNumber
declare const One: BigNumber
declare const Two: BigNumber
declare const WeiPerEther: BigNumber
declare const MaxUint256: BigNumber

declare function getDefaultProvider(network?: Network | string, options?: any): BaseProvider

declare enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  OFF = 'OFF'
}
declare enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  BUFFER_OVERRUN = 'BUFFER_OVERRUN',
  NUMERIC_FAULT = 'NUMERIC_FAULT',
  MISSING_NEW = 'MISSING_NEW',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  MISSING_ARGUMENT = 'MISSING_ARGUMENT',
  UNEXPECTED_ARGUMENT = 'UNEXPECTED_ARGUMENT',
  CALL_EXCEPTION = 'CALL_EXCEPTION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  NONCE_EXPIRED = 'NONCE_EXPIRED',
  REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED',
  UNPREDICTABLE_GAS_LIMIT = 'UNPREDICTABLE_GAS_LIMIT'
}
declare class Logger {
  readonly version: string
  static errors: typeof ErrorCode
  static levels: typeof LogLevel
  constructor(version: string)
  _log(logLevel: LogLevel, args: Array<any>): void
  debug(...args: Array<any>): void
  info(...args: Array<any>): void
  warn(...args: Array<any>): void
  makeError(message: string, code?: ErrorCode, params?: any): Error
  throwError(message: string, code?: ErrorCode, params?: any): never
  throwArgumentError(message: string, name: string, value: any): never
  checkNormalize(message?: string): void
  checkSafeUint53(value: number, message?: string): void
  checkArgumentCount(count: number, expectedCount: number, message?: string): void
  checkNew(target: any, kind: any): void
  checkAbstract(target: any, kind: any): void
  static globalLogger(): Logger
  static setCensorship(censorship: boolean, permanent?: boolean): void
  static setLogLevel(logLevel: LogLevel): void
}

declare const logger: utils.Logger

declare const provider: Provider
