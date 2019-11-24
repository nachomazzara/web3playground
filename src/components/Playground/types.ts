import { ReactElement } from 'react'
import { Contract } from 'web3-eth-contract/types'

export type SelectedContract = {
  instance: Contract | null
  address: string
  name: string
  isProxy: boolean
  error?: string | ReactElement<HTMLElement> | null
}

export type Contracts = { [address: string]: SelectedContract }
