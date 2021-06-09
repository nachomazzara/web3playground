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

export const CHAINS = {
  ETHEREUM_MAINNET: { value: 'mainnet', label: 'Ethereum Mainnet', id: 1 },
  ETHEREUM_ROPSTEN: { value: 'ropsten', label: 'Ropsten Testnet', id: 3 },
  ETHEREUM_RINKEBY: { value: 'rinkeby', label: 'Rinkeby Testnet', id: 4 },
  ETHEREUM_GOERLI: { value: 'goerli', label: 'Goerli Testnet', id: 5 },
  ETHEREUM_KOVAN: { value: 'kovan', label: 'Kovan Testnet', id: 42 },
  BSC_MAINNET: { value: 'bsc', label: 'Binance Smart Chain Mainnet', id: 56 },
  BSC_TESTNET: {
    value: 'bsc-testnet',
    label: 'Binance Smart Chain Testnet',
    id: 97
  },
  MATIC_MAINNET: { value: 'matic', label: 'Matic Mainnet', id: 137 },
  MATIC_MUMBAI: { value: 'mumbai', label: 'Matic Mumbai', id: 80001 }
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
  return Object.values(CHAINS)
}

export function getNetworkNameById(id: number): string {
  const chain = getChains().find(chain => Number(chain.id) === Number(id))

  return chain ? chain.value : 'unknown'
}

export function getNetworkName() {
  return chainId ? getNetworkNameById(chainId) : ''
}

export function getNetworkId() {
  return chainId
}

function isEthereumChain() {
  return (
    chainId === CHAINS.ETHEREUM_MAINNET.id ||
    chainId === CHAINS.ETHEREUM_ROPSTEN.id ||
    chainId === CHAINS.ETHEREUM_KOVAN.id ||
    chainId === CHAINS.ETHEREUM_GOERLI.id ||
    chainId === CHAINS.ETHEREUM_RINKEBY.id
  )
}

function isMaticChain() {
  return (
    chainId === CHAINS.MATIC_MAINNET.id || chainId === CHAINS.MATIC_MUMBAI.id
  )
}

function isBSCChain() {
  return chainId === CHAINS.BSC_MAINNET.id || chainId === CHAINS.BSC_TESTNET.id
}

export function getAPIKey() {
  if (isEthereumChain()) {
    return '39MIMBN2J9SFTJW1RKQPYJI89BAPZEVJVD'
  }
  if (isBSCChain()) {
    return 'XUB8PMY81UWB8TFVIN8A36SZUG1Q7H4ZD5'
  }
  if (isMaticChain()) {
    return ''
  }

  console.warn(`Could not find any API Key for the chain: ${chainId}`)

  return ''
}

export function getAPI(): string {
  if (isEthereumChain()) {
    const network = getNetworkNameById(chainId)
    return `https://api${network !== 'mainnet' ? `-${network}` : ''
      }.etherscan.io/api`
  }

  if (isBSCChain()) {
    return `https://api${chainId === CHAINS.BSC_TESTNET.id ? '-testnet' : ''
      }.bscscan.com/api`
  }

  if (isMaticChain()) {
    return `https://api${chainId === CHAINS.BSC_TESTNET.id ? '-testnet' : ''
      }.polygonscan.com/api`
  }

  console.warn(`Could not find any API for the chain: ${chainId}`)

  return ''
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
