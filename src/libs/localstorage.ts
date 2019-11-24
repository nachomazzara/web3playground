
const KEY_BASE = 'web3playground-'
const KEY_LAST_USED = `${KEY_BASE}last-used-`
const KEY_NETWORK = `${KEY_BASE}network`
const KEY_CONTRACTS = `${KEY_LAST_USED}contracts`
const KEY_CODE = `${KEY_LAST_USED}code`


export type LastUsedContracts = {
  name: string
  address: string
  isProxy: boolean
}[]


export function saveLastUsedNetwork(network: string) {
  window.localStorage.setItem(KEY_NETWORK, network)
}

export function getLastUsedNetwork(): string {
  const data = window.localStorage.getItem(KEY_NETWORK)
  return data ? data : 'mainnet'
}

export function saveLastUsedContracts(contracts: LastUsedContracts) {
  window.localStorage.setItem(KEY_CONTRACTS, JSON.stringify(contracts))
}

export function getLastUsedContracts(): LastUsedContracts | null {
  const data = window.localStorage.getItem(KEY_CONTRACTS)
  return data ? JSON.parse(data) : {}
}

export function saveLastUsedCode(code: string) {
  window.localStorage.setItem(KEY_CODE, code)
}

export function getLastUsedCode(): string | null {
  const data = window.localStorage.getItem(KEY_CODE)
  return data ? data : null
}