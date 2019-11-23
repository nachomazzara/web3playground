import React, {
  ReactElement,
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'

import Loader from 'components/Loader'
import Editor from 'components/Editor'
import { findABIForProxy, getContract } from 'libs/contract'
import { Contracts, SelectedContract } from './types'

import './Playground.css'
import { saveLastUsedContracts, getLastUsedContracts } from 'libs/localstorage'

export default function Playground() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | ReactElement<HTMLElement> | null>(
    null
  )
  const [contracts, setContracts] = useState<Contracts>({})
  const isInitialMount = useRef(true)

  // Did Mount
  useEffect(() => {
    const lastUsedContracts = getLastUsedContracts()
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

    for (let i = 0; i < selectedContracts.length; i++) {
      const contract = selectedContracts[i]
      let contractInstance

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

      if (contractInstance) {
        setContracts({
          ...contracts,
          [contract.address]: {
            instance: contractInstance,
            address: contract.address || 'contract',
            name: contract.name,
            isProxy: contract.isProxy
          }
        })
        setError(null)
        // await this.setContractName()
      } else {
        setError(
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
    setIsLoading(false)
  }

  function renderContract(contract: SelectedContract | null, key?: string) {
    return (
      <form key={key ? key : '0'}>
        <input
          name="address"
          type="text"
          placeholder="contract address"
          value={contract ? contract.address : ''}
          onChange={addContract}
        />
        <input
          name="name"
          type="text"
          placeholder="variable name"
          value={contract ? contract.name : key ? `contract${key}` : ''}
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
      </form>
    )
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="header">
        <h1>Web3 Playground</h1>
        <h2>Contracts</h2>
        {Object.keys(contracts).map(key => renderContract(contracts[key], key))}
        {renderContract(null)}
        {error}
      </div>
      <Editor contracts={contracts} />
    </div>
  )
}
