import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { HttpProvider } from 'web3-providers-http/types'
import { saveLastUsedNetwork } from './localstorage'

export interface EthereumWindow {
  ethereum?: HttpProvider & {
    enable?: () => Promise<string[]>
    send: any
    on: (eventName: string, callback: any) => void
    off: (eventName: string, callback: any) => void
    autoRefreshOnNetworkChange: boolean
    networkVersion: number
  }
}

const { ethereum } = window as EthereumWindow

if (ethereum) {
  ethereum.autoRefreshOnNetworkChange = false
}

let web3: Web3
let chainId: number

export function getWeb3Instance(): Web3 {
  const { ethereum } = window as EthereumWindow

  const networkChanged = ethereum && ethereum.networkVersion !== chainId

  if (!web3 || networkChanged) {
    chainId = ethereum ? ethereum.networkVersion : 0
    web3 = new Web3(
      ethereum
        ? ethereum
        : new Web3.providers.HttpProvider('https://localhost:8545')
    )
  }
  return web3
}

export async function getDefaultAccount(): Promise<string | undefined> {
  const { ethereum } = window as EthereumWindow

  try {
    if (ethereum && ethereum.enable) {
      await ethereum.enable()
      const accounts = await getWeb3Instance().eth.getAccounts()
      return accounts[0]
    }
  } catch (e) {
    console.log(e.message)
    throw new Error('Please connect your wallet')
  }
}

export function getChains() {
  return [
    { value: 'mainnet', label: 'Ethereum Mainnet', id: 1 },
    { value: 'ropsten', label: 'Ropsten Testnet', id: 3 },
    { value: 'kovan', label: 'Kovan Testnet', id: 42 },
    { value: 'rinkeby', label: 'Rinkeby Testnet', id: 4 },
    { value: 'goerli', label: 'Goerli Testnet', id: 5 }
  ]
}

export function getNetworkNameById(id: number): string {
  const chain = getChains().find(chain => Number(chain.id) === Number(id))

  return chain ? chain.value : 'unknown'
}

export function getNetworkName() {
  return chainId ? getNetworkNameById(chainId) : ''
}

export function getNetworkId() {
  return chainId;
}

export function getAPI(): string {
  const network = getNetworkNameById(chainId)
  return `https://api${
    network !== 'mainnet' ? `-${network}` : ''
    }.etherscan.io/api`
}

export function useNetwork() {
  const [network, setNetwork] = useState(getNetworkName())

  useEffect(() => {
    const web3 = getWeb3Instance()
    function handleNetworkChanged(networkId: number, saveLastUsed = true) {
      chainId = networkId
      setNetwork(getNetworkNameById(networkId))

      if (saveLastUsed) {
        saveLastUsedNetwork(networkId)
      }
    }

    if (ethereum) {
      ethereum.on('chainChanged', () => handleNetworkChanged)
      ethereum.on('networkChanged', handleNetworkChanged)
      web3.eth.net.getId().then((res) => handleNetworkChanged(res, false))
    }

    return () => {
      if (ethereum) {
        ethereum.off('chainChanged', handleNetworkChanged)
        ethereum.off('networkChanged', handleNetworkChanged)
      }
    }
  }, [])

  return network
}