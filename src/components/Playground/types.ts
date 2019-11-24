import { ReactElement } from 'react'
import { Contract } from 'web3-eth-contract/types'

export type SelectedContractError = string | ReactElement<HTMLElement> | null

export type SelectedContract = {
  instance: Contract | null
  address: string
  name: string
  isProxy: boolean
  error?: SelectedContractError
}

export type SelectedContracts = { [address: string]: SelectedContract }
