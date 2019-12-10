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

let web3: Web3
let chainId: number

export async function connect() {
  if (web3 && chainId) {
    return web3
  }

  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false
    if (ethereum.enable) {
      await ethereum.enable()
    }
    web3 = new Web3(ethereum)
    chainId = await web3.eth.net.getId()
  } else {
    chainId = 0
    web3 = new Web3(new Web3.providers.HttpProvider('https://localhost:8545'))
  }

  return web3
}

export async function getWeb3Instance(): Promise<Web3> {
  return connect()
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
      getWeb3Instance().then(() => handleNetworkChanged(chainId, false))
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