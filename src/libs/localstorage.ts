
import { getNetworkId } from 'libs/web3'

import { restoreBeforeUnload } from './beforeUnload'
import { File } from 'components/Files/types'

const KEY_BASE = 'web3playground-'
const KEY_FILES = `${KEY_BASE}files`
const KEY_NETWORK = `${KEY_BASE}network`
const KEY_LAST_USED = `${KEY_BASE}last-used-`
const KEY_CONTRACTS = `${KEY_LAST_USED}contracts`
const KEY_CODE = `${KEY_LAST_USED}code`

export type LastUsedContracts = {
  name: string
  address: string
  isProxy: boolean
}[]

// Files
export function saveFile(file: File) {
  if (!file.id && !file.name) {
    console.error('Could not save file')
    return
  }

  const saveFiles = getFiles()

  if (saveFiles.map(savedFile => savedFile.id).includes(file.id)) {
    // Nothing to save
    return
  }

  saveFiles.push(file)

  window.localStorage.setItem(KEY_FILES, JSON.stringify(saveFiles))
}

export function getFiles(): File[] {
  const data = window.localStorage.getItem(KEY_FILES)
  return data ? JSON.parse(data) : []
}

export function removeFile(file: File) {
  const saveFiles = getFiles()

  const files = saveFiles.filter(savedFile => savedFile.id !== file.id)

  window.localStorage.setItem(KEY_FILES, JSON.stringify(files))
}

// Network
export function saveLastUsedNetwork(networkId: number) {
  window.localStorage.setItem(KEY_NETWORK, networkId.toString())
}

export function getLastUsedNetwork(): number {
  const data = window.localStorage.getItem(KEY_NETWORK)
  return data ? Number(data) : -1
}

// Contract
export function saveLastUsedContracts(contracts: LastUsedContracts) {
  window.localStorage.setItem(KEY_CONTRACTS, JSON.stringify(contracts))

  const networkId = getNetworkId()
  if (networkId) {
    saveLastUsedNetwork(networkId)
  }
}

export function getLastUsedContracts(): LastUsedContracts | null {
  const data = window.localStorage.getItem(KEY_CONTRACTS)
  return data ? JSON.parse(data) : {}
}

// Code
export function saveLastUsedCode(code: string) {
  window.localStorage.setItem(KEY_CODE, code)
  restoreBeforeUnload()
}

export function getLastUsedCode(): string | null {
  const data = window.localStorage.getItem(KEY_CODE)
  return data ? data : null
}