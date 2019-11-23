import { ReactElement } from 'react'
import { Contract } from 'web3-eth-contract/types'

export type Props = {}

export type SelectedContracts = {
  instance: Contract
  name: string
  isProxy: boolean
}

export type Contracts = { [key: string]: SelectedContracts }

export type State = {
  isLoading: boolean
  error: string | ReactElement<HTMLElement> | null
  contracts: Contracts
}