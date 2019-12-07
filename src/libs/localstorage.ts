
import { getNetworkId } from 'libs/web3'

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


export function saveLastUsedNetwork(networkId: number) {
  window.localStorage.setItem(KEY_NETWORK, networkId.toString())
}

export function getLastUsedNetwork(): number {
  const data = window.localStorage.getItem(KEY_NETWORK)
  return data ? Number(data) : -1
}

export function saveLastUsedContracts(contracts: LastUsedContracts) {
  window.localStorage.setItem(KEY_CONTRACTS, JSON.stringify(contracts))
  saveLastUsedNetwork(getNetworkId())
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