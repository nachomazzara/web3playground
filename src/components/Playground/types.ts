import { ReactElement } from 'react'
import { Contract } from 'web3-eth-contract/types'
import { AbiItem } from 'web3-utils'

import { Contract as EthersContract, ethers } from 'ethers'

export type Props = {
  fileId?: string
  isMaximized: boolean
  handleToggleMaximizeEditor: () => void
}

export type SelectedContractError = string | ReactElement<HTMLElement> | null

export type SelectedContract = {
  instance: Contract | EthersContract | null
  address: string
  name: string
  isProxy: boolean
  abi: AbiItem | ethers.ContractInterface
  error?: SelectedContractError
}

export type SelectedContracts = { [address: string]: SelectedContract }
