import Web3 from 'web3'
import { Contract } from 'web3-eth-contract/types'
import { AbiItem } from 'web3-utils'
import ethers, { Contract as EthersContract } from 'ethers'

import { getWeb3Instance, getAPI, getAPIKey } from './web3'
import { SelectedContracts, ABI } from 'components/Playground/types'
import { LIB } from '../constants'

export const EMPTY_SLOT =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TOPICS_FOR_PROXYS = [
  {
    topic: '0xe74baeef5988edac1159d9177ca52f0f3d68f624a1996f77467eb3ebfb316537', // Upgrade(address,bytes)
    indexed: 1
  },
  {
    topic: '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', // Upgraded(address)
    dataIndex: 1
  },
  {
    topic: '0x4d72fe0577a3a3f7da968d7b892779dde102519c25527b29cf7054f245c791b9', // Aragon's Initialization
    indexed: 2
  }
]

export const SLOTS_FOR_PROXYS = [
  '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3', // Zep
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc' // EIP 1967
]

export async function getContract(
  address: string,
  library: LIB,
  toAddress?: string
): Promise<{
  contract: Contract | EthersContract
  abi: AbiItem | ethers.ethers.ContractInterface
} | null> {
  const res = await fetch(
    `${getAPI()}?module=contract&apikey=${getAPIKey()}&action=getabi&address=${address}`
  )
  const abi = await res.json()

  if (abi.result === 'Contract source code not verified') {
    return null
  }

  const contract = await buildContract(
    library,
    abi.result,
    toAddress || address
  )
  return contract ? { contract, abi: abi.result } : null
}

export function buildContract(library: LIB, abi: ABI, address: string) {
  switch (library) {
    case LIB.WEB3:
      return getContractWeb3(abi, address)
    case LIB.ETHERS:
      return getContractEthers(abi, address)
    default: {
      console.warn('Invalid Lib')
      return null
    }
  }
}

export async function getContractWeb3(
  abi: any,
  address: string
): Promise<Contract | null> {
  const web3 = await getWeb3Instance()
  try {
    return new web3.eth.Contract(JSON.parse(abi), address)
  } catch (e) {
    console.warn(e.message)
    return null
  }
}

export async function getContractEthers(
  abi: any,
  address: string
): Promise<EthersContract | null> {
  try {
    return new EthersContract(
      address,
      JSON.parse(abi),
      // @ts-ignore
      new ethers.providers.Web3Provider(window.ethereum).getSigner()
    )
  } catch (e) {
    console.warn(e.message)
    return null
  }
}

export async function findABIForProxy(
  proxyAddress: string
): Promise<string | undefined> {
  const web3 = await getWeb3Instance()
  const api = `${getAPI()}?module=logs&action=getLogs&apikey=${getAPIKey()}&fromBlock=0&toBlock=latest&limit=1&address=${proxyAddress}&topic0=`

  let address
  for (let { topic, indexed, dataIndex } of TOPICS_FOR_PROXYS) {
    try {
      const res = await fetch(`${api}${topic}`)
      const data = await res.json()
      if (data.result.length > 0 && typeof data.result !== 'string') {
        const event = data.result.pop()
        address = indexed
          ? getAddressByTopic(event, indexed!)
          : getAddressByData(event, dataIndex!)

        if (address && address !== '0x' && address !== ZERO_ADDRESS) {
          return address
        }
      }
    } catch (e) {
      console.warn(e.messge)
    }
  }

  address = await getAddressByStorageSlot(web3, proxyAddress)

  if (
    !address ||
    (address && (address === EMPTY_SLOT || address === ZERO_ADDRESS))
  ) {
    address = await getAddressByMinimalProxy(web3, proxyAddress)
  }

  return address
}

function getAddressByTopic(event: { topics: string[] }, index: number) {
  return `0x${event.topics[index].slice(-40)}`
}

function getAddressByData(event: { data: string }, index: number) {
  const from = 32 * (index - 1) + 24
  return `0x${event.data.slice(2).substr(from, from + 40)}`
}

async function getAddressByStorageSlot(
  web3: Web3,
  proxyAddress: string
): Promise<string | undefined> {
  for (const storage of SLOTS_FOR_PROXYS) {
    try {
      const res = await fetch(
        `${getAPI()}?module=proxy&action=eth_getStorageAt&address=${proxyAddress}&apikey=${getAPIKey()}&position=${storage}&tag=latest`
      )
      const data = (await res.json()).result

      let address
      if (data && web3.utils.isAddress(data.slice(-40))) {
        address = `0x${data.slice(-40)}`
      }

      if (address && address !== '0x' && address !== ZERO_ADDRESS) {
        return address
      }
    } catch (e) {
      // Do Nothing
    }
  }
}

export async function getAddressByMinimalProxy(
  web3: Web3,
  proxyAddress: string
): Promise<string | undefined> {
  const res = await fetch(
    `${getAPI()}?module=proxy&apikey=${getAPIKey()}&action=eth_getCode&address=${proxyAddress}`
  )
  const data = (await res.json()).result

  let address
  const startFrom = data.indexOf('0x36') !== -1 ? 22 : 24 // If it is minimal proxy EIP-1167, starts from 22 (363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3)
  const possibleAddress = `0x${data.slice(startFrom, startFrom + 40)}`
  if (data && web3.utils.isAddress(possibleAddress)) {
    address = possibleAddress
  }

  return address
}

export function sanitizeABI(abi: string) {
  return abi
    .trim()
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, '')
    .replace(
      /(\w+:)|(\w+ :)/g,
      matchedStr => `"${matchedStr.substring(0, matchedStr.length - 1)}":`
    )
}

export function typeContractMethods(
  editorTypes: string,
  contracts: SelectedContracts,
  library: LIB
): string {
  switch (library) {
    case LIB.WEB3:
      return typeWeb3ContractMethods(editorTypes, contracts)
    case LIB.ETHERS:
      return typeEthersContractMethods(editorTypes, contracts)
    default:
      return ''
  }
}

// Replace `methods: any` to `{ methodName: (params: types) Promise<any>}`
export function typeWeb3ContractMethods(
  editorTypes: string,
  contracts: SelectedContracts
) {
  return (
    editorTypes +
    Object.keys(contracts)
      .filter(key => contracts[key].instance)
      .map(key => {
        const contract = contracts[key].instance!
        const contractTypes = `declare var ${contracts[key].name}: Contract & {
  methods: {
    ${contract.options.jsonInterface
            .map((method: any) => {
              let inputs = ''

              if (!method.inputs || method.type === 'constructor') {
                return ''
              }

              method.inputs.forEach((input: any, index: number) => {
                if (index > 0) {
                  inputs += ', '
                }

                inputs += input.name
                  ? input.name
                  : method.inputs.length > 1
                    ? `${input.type}_${index}`
                    : input.type

                if (input.type.indexOf('int') !== -1) {
                  inputs += ': number | string'
                } else {
                  inputs += ': string'
                }

                if (input.type.indexOf('[]') !== -1) {
                  inputs += `[]`
                }
              })

              return `${method.name}: (${inputs}) => any`
            })
            .join('\n')}
  }`

        return contractTypes
      })
      .join('\n')
  )
}

// Replace `methods: any` to `{ methodName: (params: types) Promise<any>}`
export function typeEthersContractMethods(
  editorTypes: string,
  contracts: SelectedContracts
) {
  return (
    editorTypes +
    Object.keys(contracts)
      .filter(key => contracts[key].instance)
      .map(key => {
        const contract: EthersContract = (contracts[key]
          .instance as EthersContract)!

        const methodTypes = contract.interface.fragments
          .map((method: any) => {
            let inputs = ''

            if (!method.inputs || method.type === 'constructor') {
              return ''
            }

            method.inputs.forEach((input: any, index: number) => {
              if (index > 0) {
                inputs += ', '
              }

              inputs += input.name
                ? input.name
                : method.inputs.length > 1
                  ? `${input.type}_${index}`
                  : input.type

              if (input.type.indexOf('int') !== -1) {
                inputs += ': number | string'
              } else {
                inputs += ': string'
              }

              if (input.type.indexOf('[]') !== -1) {
                inputs += `[]`
              }
            })

            // @TODO: with outputs
            // let outputs = ''
            // method.outputs.forEach((input: any, index: number) => {
            //   if (index > 0) {
            //     outputs += ', '
            //   }

            //   outputs += input.name
            //     ? input.name
            //     : method.outputs.length > 1
            //       ? `${input.type}_${index}`
            //       : input.type

            //   if (input.type.indexOf('int') !== -1) {
            //     outputs += ': number | string'
            //   } else {
            //     outputs += ': string'
            //   }

            //   if (input.type.indexOf('[]') !== -1) {
            //     outputs += `[]`
            //   }
            // })

            // return `${method.name}: (${inputs}) => ${method.constant ? `Promise<${outputs}>` : '____MethodResult'}`

            return `${method.name}: (${inputs}) => ${method.constant ? '____any' : '____MethodResult'
              }`
          })
          .join('\n')

        const contractTypes = `declare var ${contracts[key].name}: Contract & {
      readonly functions: {
        ${methodTypes
            .replace(/____MethodResult/g, 'Promise<ContractTransaction>')
            .replace(/____any/g, 'Promise<any>')}
      }
      readonly callStatic: {
        ${methodTypes
            .replace(/____MethodResult/g, 'Promise<ContractTransaction>')
            .replace(/____any/g, 'Promise<any>')}
      }
      readonly estimateGas: {
        ${methodTypes
            .replace(/____MethodResult/g, 'Promise<BigNumber>')
            .replace(/____any/g, 'Promise<BigNumber>')}
      }
      readonly populateTransaction: {
        ${methodTypes
            .replace(/____MethodResult/g, 'Promise<PopulatedTransaction>')
            .replace(/____any/g, 'Promise<PopulatedTransaction>')}
      }
      readonly filters: {
        ${methodTypes
            .replace(/____MethodResult/g, '(...args: Array<any>) => EventFilter')
            .replace(/____any/g, '(...args: Array<any>) => EventFilter')}
      }
      ${methodTypes
            .replace(/____MethodResult/g, 'Promise<ContractTransaction>')
            .replace(/____any/g, 'Promise<any>')}
    }`

        return contractTypes
      })
      .join('\n')
  )
}
