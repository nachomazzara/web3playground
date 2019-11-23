import { ReactElement } from 'react'
import { Contract } from 'web3-eth-contract/types'

export type Props = {}

export type SelectedContract = {
  instance: Contract
  address: string
  name: string
  isProxy: boolean
}

export type Contracts = { [key: string]: SelectedContract }

export type State = {
  isLoading: boolean
  error: string | ReactElement<HTMLElement> | null
  contracts: Contracts
}