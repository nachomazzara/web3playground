import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'

import Loader from 'components/Loader'
import Editor from 'components/Editor'
import { findABIForProxy, getContract } from 'libs/contract'
import { saveLastUsedContracts, getLastUsedContracts } from 'libs/localstorage'
import { omit } from 'libs/utils'
import { Contracts, SelectedContract, SelectedContractError } from './types'

import './Playground.css'

export default function Playground() {
  const [isLoading, setIsLoading] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [contracts, setContracts] = useState<Contracts>({})
  const isInitialMount = useRef(true)

  // Did Mount
  useEffect(() => {
    async function loadContracts(lastUsedContracts: SelectedContract[]) {
      const newContracts = {}
      for (let i = 0; i < lastUsedContracts.length; i++) {
        const contract = lastUsedContracts[i]
        const { instance, error } = await getContractInstance(contract)

        newContracts[contract.address] = {
          ...contract,
          instance,
          error
        }
      }

      setContracts(newContracts)
    }
    const lastUsedContracts = getLastUsedContracts()
    if (lastUsedContracts) {
      loadContracts(lastUsedContracts as SelectedContract[])
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

  function fillSelectedContract(event: React.FormEvent<any>) {
    const elements = event.currentTarget.form
    const contract = {}
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      contract[element.name] = element.value
    }

    return contract as SelectedContract
  }

  async function handleAddressChange(
    event: React.FormEvent<any>,
    prevValue?: string
  ) {
    event.preventDefault()

    if (event.currentTarget.value.length) {
      const newContract = fillSelectedContract(event)
      const { instance, error } = await getContractInstance(newContract)

      setContracts({
        ...omit(contracts, prevValue),
        [newContract.address]: {
          ...newContract,
          instance,
          error
        }
      })
    } else {
      setContracts(omit(contracts, prevValue))
    }
  }

  function handleNameChange(event: React.FormEvent<any>) {
    event.preventDefault()

    const newContract = fillSelectedContract(event)
    const editedContract = contracts[newContract.address]

    if (editedContract) {
      setContracts({
        ...contracts,
        [editedContract.address]: {
          ...editedContract,
          name: event.currentTarget.value
        }
      })
    }
  }

  async function handleIsProxyChange(event: React.FormEvent<any>) {
    event.preventDefault()

    const newContract = fillSelectedContract(event)
    const editedContract = contracts[newContract.address]

    if (editedContract) {
      newContract.isProxy = !editedContract.isProxy
    } else {
      newContract.isProxy = false
    }

    const { instance, error } = await getContractInstance(newContract)

    setContracts({
      ...contracts,
      [newContract.address]: {
        ...newContract,
        instance,
        error
      }
    })
  }

  async function getContractInstance(contract: SelectedContract) {
    setIsLoading(true)

    let instance = null
    let error: SelectedContractError = null

    if (contract.isProxy) {
      const implementationAddress = await findABIForProxy(contract.address)
      if (implementationAddress) {
        instance = await getContract(implementationAddress, contract.address)
      }
    } else {
      instance = await getContract(contract.address)
    }

    if (!instance) {
      error = (
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

    setIsLoading(false)

    return { instance, error }
  }

  function renderContract(contract?: SelectedContract) {
    let address: string | undefined,
      name: string | undefined,
      error: SelectedContractError | undefined

    if (contract) {
      address = contract.address
      name = contract.name
      error = contract.error
    }

    return (
      <form key={address || Date.now()}>
        <div>
          <input
            name="address"
            type="text"
            placeholder="contract address"
            value={address}
            onChange={e => handleAddressChange(e, address)}
          />
          <input
            name="name"
            type="text"
            placeholder="variable name"
            value={name}
            disabled={!address}
            onChange={handleNameChange}
          />
        </div>
        <div className="isProxy">
          <input
            name="isProxy"
            id="checkbox"
            type="checkbox"
            disabled={!address}
            onChange={handleIsProxyChange}
            checked={contract ? contract.isProxy : false}
          />
          <label htmlFor="checkbox">
            {'Upgradable contract using the proxy pattern'}
          </label>
        </div>
        {error && <div className="error">{error}</div>}
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
        {Object.keys(contracts).map(key => renderContract(contracts[key]))}
        {renderContract()}
      </div>
      <Editor
        contracts={contracts}
        isMaximized={isMaximized}
        onChangeSize={handleToggleMaximizeEditor}
      />
    </div>
  )
}
