import { getLastUsedNetwork, getLastUsedCode, getLastUsedContracts } from 'libs/localstorage'
import { timeoutPromise } from 'libs/utils'
import { File } from 'components/Files/types'

const IPFS_RESOLVER = 'https://ipfs.io/ipfs/'
const PINATA_RESOLVER = 'https://gateway.pinata.cloud/ipfs/'

// I know that I am exposing secret keys but it is in purpose!
export async function upload() {
  const pinataAPIKey = '41d9d533daec1ccef42a'
  const pinataSecretAPIKey = '1721c608c98314394260fb427e6f7ba6ace1e1876ebc4b645387f95bb77eacf0'

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`

  const obj = {
    network: getLastUsedNetwork(),
    contracts: getLastUsedContracts(),
    code: getLastUsedCode(),
  }

  const json = JSON.stringify(obj)
  const blob = new Blob([json], {
    type: 'application/json'
  })

  const data = new FormData()
  data.append("file", blob, `web3playground-${Date.now()}.json`)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataAPIKey,
        'pinata_secret_api_key': pinataSecretAPIKey
      },
      body: data,
    }
    )

    return res.json()
  } catch (e) {
    return { error: e.message }
  }
}

// Try pinata resolver first, then IPFS https resolver, then kaput!
export async function resolveHash(hash: string) {
  let data
  try {
    data = await resolve(hash, PINATA_RESOLVER)
  } catch (e) {
    if (e.message === 'timeout') {
      data = await resolve(hash, IPFS_RESOLVER)
    } else {
      throw e
    }
  }
  return data
}

async function resolve(hash: string, resolver: string) {
  const res = await timeoutPromise(fetch(`${resolver}${hash}`), 30000)
  return res.json()
}

export function normalizeIPFSHash(hash: string): File {
  return { name: hash, id: hash }
}
