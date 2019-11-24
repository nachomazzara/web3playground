import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'

import Loader from 'components/Loader'
import Editor from 'components/Editor'
import { findABIForProxy, getContract } from 'libs/contract'
import { Contracts, SelectedContract } from './types'

import './Playground.css'
import { saveLastUsedContracts, getLastUsedContracts } from 'libs/localstorage'

export default function Playground() {
  const [isLoading, setIsLoading] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [contracts, setContracts] = useState<Contracts>({})
  const isInitialMount = useRef(true)

  // Did Mount
  useEffect(() => {
    const lastUsedContracts = getLastUsedContracts()
    console.log('aaa')
    if (lastUsedContracts) {
      setContract(lastUsedContracts as SelectedContract[])
    }
    //@TODO: remove it
    // eslint-disable-next-line
  }, [])

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const contractsToSave = Object.keys(contracts).map(key => ({
        name: contracts[key].name,
        address: contracts[key].address,
        isProxy: contracts[key].isProxy
      }))
      saveLastUsedContracts(contractsToSave)
    }
  }, [contracts])

  function addContract(event: React.FormEvent<any>) {
    event.preventDefault()

    const elements = event.currentTarget.form
    const contract = {}
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      contract[element.name] = element.value
    }

    if (event.currentTarget.name === 'name' && contracts[contract['address']]) {
      return setContracts({
        ...contracts,
        [contract['address']]: {
          ...contracts[contract['address']],
          name: event.currentTarget.value
        }
      })
    }

    if (
      event.currentTarget.name === 'isProxy' &&
      contracts[contract['address']]
    ) {
      contract[event.currentTarget.name] = !contracts[contract['address']]
        .isProxy
    } else if (!contracts[contract['address']]) {
      contract['isProxy'] = false
    }

    setContract([contract] as SelectedContract[])
  }

  async function setContract(selectedContracts: SelectedContract[]) {
    setIsLoading(true)
    const newContracts: Contracts = {}

    for (let i = 0; i < selectedContracts.length; i++) {
      const contract = selectedContracts[i]
      let contractInstance = null

      if (contract.isProxy) {
        const implementationAddress = await findABIForProxy(contract.address)
        if (implementationAddress) {
          contractInstance = await getContract(
            implementationAddress,
            contract.address
          )
        }
      } else {
        contractInstance = await getContract(contract.address)
      }

      newContracts[contract.address] = {
        instance: contractInstance,
        address: contract.address,
        name: contract.name,
        isProxy: contract.isProxy
      }

      if (!contractInstance) {
        newContracts[contract.address].error = (
          <p>
            {'No implementation found. Please contact me'}
            <a
              href="https://twitter.com/nachomazzara"
              target="_blank"
              rel="noopener noreferrer"
            >
              {'@nachomazzara'}
            </a>
          </p>
        )
      }
    }
    setContracts({
      ...contracts,
      ...newContracts
    })
    setIsLoading(false)
  }

  function renderContract(contract: SelectedContract | null, key?: string) {
    let address, name, error

    if (contract) {
      address = contract.address
      name = contract.name
      error = contract.error
    }

    return (
      <form key={key ? key : '0'}>
        <input
          name="address"
          type="text"
          placeholder="contract address"
          value={address}
          onChange={addContract}
        />
        <input
          name="name"
          type="text"
          placeholder="variable name"
          value={name}
          onChange={addContract}
        />
        <div className="isProxy">
          <input
            name="isProxy"
            id="checkbox"
            type="checkbox"
            onChange={addContract}
            checked={contract ? contract.isProxy : false}
          />
          <label htmlFor="checkbox">
            {'Upgradable contract using the proxy pattern'}
          </label>
        </div>
        {error && <p>{error}</p>}
      </form>
    )
  }

  function handleToggleMaximizeEditor() {
    setIsMaximized(!isMaximized)
  }

  return (
    <div className={`Playground ${isMaximized ? ' maximized' : ''}`}>
      {isLoading && <Loader />}
      <div className="header">
        <h1>Web3 Playground</h1>
        <h2>Contracts</h2>
        {Object.keys(contracts).map(key => renderContract(contracts[key], key))}
        {renderContract(null)}
      </div>
      <Editor
        contracts={contracts}
        isMaximized={isMaximized}
        onChangeSize={handleToggleMaximizeEditor}
      />
    </div>
  )
}
