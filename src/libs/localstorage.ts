import { getNetworkId } from 'libs/web3'

import { restoreBeforeUnload } from './beforeUnload'
import { normalizeIPFSHash } from './ipfs'
import { File } from 'components/Files/types'
import { LIB } from '../constants'

const KEY_BASE = 'web3playground-'
const KEY_FILES = `${KEY_BASE}files`
const KEY_NETWORK = `${KEY_BASE}network`
const KEY_LAST_USED = `${KEY_BASE}last-used-`
const KEY_CONTRACTS = `${KEY_LAST_USED}contracts`
const KEY_CODE = `${KEY_LAST_USED}code`
const KEY_LIBRARY = `${KEY_LAST_USED}library`

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

  try {
    window.localStorage.setItem(KEY_FILES, JSON.stringify(saveFiles))
  } catch (e) {
    console.warn(e.message)
  }
}

export function getFiles(): File[] {
  const data = window.localStorage.getItem(KEY_FILES)
  return data ? JSON.parse(data) : []
}

export function removeFile(file: File) {
  const saveFiles = getFiles()

  const files = saveFiles.filter(savedFile => savedFile.id !== file.id)

  try {
    window.localStorage.setItem(KEY_FILES, JSON.stringify(files))
  } catch (e) {
    console.warn(e.message)
  }
}

export function renameFile(file: File) {
  const saveFiles = getFiles()
  for (let i = 0; i < saveFiles.length; i++) {
    if (saveFiles[i].id === file.id) {
      saveFiles[i].name = file.name
      try {
        window.localStorage.setItem(KEY_FILES, JSON.stringify(saveFiles))
      } catch (e) {
        console.warn(e.message)
      }
      return
    }
  }
}

export function getFileFromHash(hash: string) {
  const files = getFiles()
  return files.filter(file => file.id === hash)[0] || normalizeIPFSHash(hash)
}

// Network
export function saveLastUsedNetwork(networkId: number) {
  try {
    window.localStorage.setItem(KEY_NETWORK, networkId.toString())
  } catch (e) {
    console.warn(e.message)
  }
}

export function getLastUsedNetwork(): number {
  const data = window.localStorage.getItem(KEY_NETWORK)
  return data ? Number(data) : -1
}

// Contract
export function saveLastUsedContracts(contracts: LastUsedContracts) {
  try {
    window.localStorage.setItem(KEY_CONTRACTS, JSON.stringify(contracts))
  } catch (e) {
    console.warn(e.message)
  }
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
  try {
    window.localStorage.setItem(KEY_CODE, code)
    restoreBeforeUnload()
  } catch (e) {
    console.warn(e.message)
  }
}

export function getLastUsedCode(): string | null {
  const data = window.localStorage.getItem(KEY_CODE)
  return data ? data : null
}

// Library
export function saveLastUsedLibrary(library: LIB) {
  try {
    window.localStorage.setItem(KEY_LIBRARY, library)
    restoreBeforeUnload()
  } catch (e) {
    console.warn(e.message)
  }
}

export function getLastUsedLibrary(): LIB {
  const data = window.localStorage.getItem(KEY_LIBRARY)
  return data ? (data as LIB) : LIB.WEB3
}
