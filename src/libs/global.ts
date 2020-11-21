import { ethers } from 'ethers'

import { getWeb3Instance } from './web3'
import { LIB } from '../constants'
import { SelectedContracts } from 'components/Playground/types'

export async function injectGlobals(
  library: LIB,
  prevContracts?: SelectedContracts,
  newContract?: SelectedContracts
) {
  switch (library) {
    case LIB.WEB3: {
      // @ts-ignore
      window['web3'] = await getWeb3Instance()
      break
    }
    case LIB.ETHERS: {
      // @ts-ignore
      window['ethers'] = ethers
      // @ts-ignore
      window['provider'] = new ethers.providers.Web3Provider(window.ethereum)
      Object.keys(ethers).forEach(k => {
        // @ts-ignore
        window[k] = ethers[k]
      })
      break
    }
    default:
      break
  }

  if (prevContracts) {
    Object.keys(prevContracts)
      .filter(key => prevContracts[key].instance)
      .forEach(key => {
        const contract = prevContracts[key]
        delete window[contract.name]
      })
  }

  if (newContract) {
    Object.keys(newContract)
      .filter(key => newContract[key].instance)
      .forEach(key => {
        const contract = newContract[key]
        window[contract.name] = contract.instance
      })
  }
}
