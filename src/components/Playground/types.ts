import { Contract } from 'web3-eth-contract/types'

export type SelectedContract = {
  instance: Contract
  address: string
  name: string
  isProxy: boolean
}

export type Contracts = { [address: string]: SelectedContract }
