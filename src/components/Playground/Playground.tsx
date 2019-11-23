import React, { PureComponent } from 'react'

import Editor from 'components/Editor'
import { findABIForProxy, getContract } from 'libs/contract'
import { getWeb3Instance } from 'libs/web3'
import { Props, State, SelectedContracts } from './types'

import './Playground.css'

export const OUTPUT_HEADLINE = '/***** Output *****/\n'

export default class Playground extends PureComponent<Props, State> {
  web3 = getWeb3Instance()

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false,
      error: null,
      contracts: {}
    }
  }

  getContract = (event: React.FormEvent<any>) => {
    event.preventDefault()

    const elements = event.currentTarget.form
    const contract = {}
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (element.name === 'isProxy') {
        contract[element.name] = element.value === 'on'
      } else {
        contract[element.name] = element.value
      }
    }

    this.getAddress(contract)
  }

  getAddress = async (contract: any) => {
    this.setState({
      isLoading: true
    })

    let contractInstance

    if (contract.isProxy) {
      const implementationAddress = await findABIForProxy(contract.address)
      if (implementationAddress) {
        contractInstance = await getContract(implementationAddress)
      }
    } else {
      contractInstance = await getContract(contract.address)
    }

    if (contractInstance) {
      this.setState({
        isLoading: false,
        contracts: {
          ...this.state.contracts,
          '0': {
            instance: contractInstance,
            name: contract.name,
            isProxy: contract.isProxy
          }
        }
      })
      // await this.setContractName()
    } else {
      this.setState({
        error: (
          <p>
            {'No implementation found. Please contact me'}
            <a href="https://twitter.com/nachomazzara" target="_blank">
              {'@nachomazzara'}
            </a>
          </p>
        )
      })
    }
  }

  renderContract = (contract: SelectedContracts | null, key?: string) => {
    return (
      <form name={key ? key : '0'}>
        <input
          name="address"
          type="text"
          value={contract ? contract.instance.options.address : ''}
          onChange={this.getContract}
        />
        <input
          name="name"
          type="text"
          value={contract ? contract.name : key ? `contract${key}` : 'contract'}
          onChange={this.getContract}
        />
        <div className="isProxy">
          <input
            name="isProxy"
            id="checkbox"
            type="checkbox"
            onChange={this.getContract}
            defaultChecked={contract ? contract.isProxy : false}
          />
          <label htmlFor="checkbox">{'Is proxy'}</label>
        </div>
      </form>
    )
  }

  render() {
    const { contracts } = this.state

    console.log(contracts)

    return (
      <div>
        <h1>Web3 Playground</h1>
        <div>
          <h2>Contracts</h2>
          {Object.keys(contracts).map(key =>
            this.renderContract(contracts[key], key)
          )}
          {this.renderContract(null)}
        </div>
        <div>
          <Editor contracts={contracts} />
        </div>
      </div>
    )
  }
}
