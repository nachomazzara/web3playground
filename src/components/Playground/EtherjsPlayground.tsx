import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback
} from 'react'

import Loader from 'components/Loader'
import EtherJsEditor from 'components/Editor/EtherJsEditor'
import { findABIForProxy, getContractEthers } from 'libs/contract'
import {
  saveLastUsedContracts,
  getLastUsedContracts,
  getLastUsedNetwork
} from 'libs/localstorage'
import { omit, filter } from 'libs/utils'
import { resolveHash } from 'libs/ipfs'
import { useNetwork, getNetworkNameById } from 'libs/web3'
import {
  Props,
  SelectedContracts,
  SelectedContract,
  SelectedContractError
} from './types'

import './Playground.css'

export default function EtherjsPlayground(props: Props) {
  const { fileId, isMaximized, handleToggleMaximizeEditor } = props

  const [isLoading, setIsLoading] = useState(false)
  const [contracts, setContracts] = useState<SelectedContracts>({})
  const [code, setCode] = useState(null)
  const [network, setNetwork] = useState<string>()
  const [error, setError] = useState<{ message: string; hash: string }>()
  const isInitialMount = useRef(true)

  const currentNetwork = useNetwork()

  const loadContracts = useCallback(
    async (lastUsedContracts: SelectedContract[]) => {
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
    },
    []
  )

  const setPlaygroundByIPFS = useCallback(
    async (hash: string) => {
      setIsLoading(true)
      try {
        const data = await resolveHash(hash)
        if (data.contracts) {
          loadContracts(data.contracts)
        }

        if (data.network) {
          setNetwork(getNetworkNameById(data.network))
        }

        if (data.code) {
          setCode(data.code)
        }
      } catch (e) {
        setError({ message: e.message, hash })
      }

      setIsLoading(false)
    },
    [loadContracts]
  )

  useEffect(() => {
    const paths = window.location.pathname.split('/').splice(1)
    const hash = paths[0]
    if (hash) {
      setPlaygroundByIPFS(hash)
    } else {
      const lastUsedContracts = getLastUsedContracts()
      const lastUsedNetwork = getLastUsedNetwork()

      if (lastUsedContracts) {
        setNetwork(getNetworkNameById(lastUsedNetwork))
        loadContracts(lastUsedContracts as SelectedContract[])
      }
    }
  }, [currentNetwork, loadContracts, setPlaygroundByIPFS])

  useEffect(() => {
    if (fileId) {
      setPlaygroundByIPFS(fileId)
    }
  }, [fileId, setPlaygroundByIPFS])

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

  function isVarNameInUse(contracts: SelectedContracts, name: string): boolean {
    return !!Object.keys(contracts).find(key => contracts[key].name === name)
  }

  function handleNameChange(event: React.FormEvent<any>) {
    event.preventDefault()

    const newContract = fillSelectedContract(event)
    const editedContract = contracts[newContract.address]

    if (editedContract) {
      const name = event.currentTarget.value.replace(/\s/g, '')
      let error = null
      if (isVarNameInUse(omit(contracts, editedContract.address), name)) {
        error = <p>{`Variable name "${name}" is already in use`}</p>
      }
      setContracts({
        ...contracts,
        [editedContract.address]: {
          ...editedContract,
          name,
          error
        }
      })
    }
  }

  async function handleAddressChange(
    event: React.FormEvent<any>,
    prevValue?: string
  ) {
    event.preventDefault()

    if (event.currentTarget.value.length) {
      const newContract = fillSelectedContract(event)
      const editedContract = contracts[newContract.address]
      if (!editedContract) {
        newContract.isProxy = false
      }

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

  function handleRemoveContract(address: string) {
    setContracts(omit(contracts, address))
  }

  async function getContractInstance(contract: SelectedContract) {
    setIsLoading(true)

    let instance = null
    let error: SelectedContractError = null

    if (contract.isProxy) {
      const implementationAddress = await findABIForProxy(contract.address)
      if (implementationAddress) {
        instance = await getContractEthers(
          implementationAddress,
          contract.address
        )
      }
    } else {
      instance = await getContractEthers(contract.address)
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
          {address && (
            <i
              className="icon trash"
              onClick={() => handleRemoveContract(address!)}
            />
          )}
        </div>
        <div className="isProxy">
          <input
            name="isProxy"
            type="checkbox"
            disabled={!address}
            onChange={handleIsProxyChange}
            checked={contract ? contract.isProxy : false}
          />
          <label htmlFor="checkbox">
            {'Upgradable contract using the proxy pattern'}{' '}
            <a
              target="_blank"
              href="https://github.com/nachomazzara/web3playground#which-proxy-implementations-are-supported"
              rel="noopener noreferrer"
            >
              ?
            </a>
          </label>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    )
  }

  return (
    <div className={`Playground ${isMaximized ? ' maximized' : ''}`}>
      {isLoading && <Loader />}
      <div className="header">
        <div className="network">
          <p className={currentNetwork}>{currentNetwork}</p>
          {currentNetwork && network && currentNetwork !== network && (
            <p className="error">
              The snippet you are trying to use is set to be run on {network}.
              Please change the network.
            </p>
          )}
        </div>
        <div className="title">
          <h1>Web3 Playground</h1>
          <div className="menu">
            <a
              target="_blank"
              href="https://github.com/nachomazzara/web3playground#how-it-works"
              rel="noopener noreferrer"
            >
              {'How it works 👨‍💻'}
            </a>
          </div>
        </div>
        {error && (
          <p className="error ipfs-error">{`Failed to load the code snippet under the hash ${error.hash}: ${error.message}`}</p>
        )}
        <h2>Contracts</h2>
        {Object.keys(contracts).map(key => renderContract(contracts[key]))}
        {renderContract()}
      </div>
      <EtherJsEditor
        contracts={filter(
          contracts,
          (contract: SelectedContract) => !contract.error
        )}
        initCode={code}
        isMaximized={isMaximized}
        onChangeSize={handleToggleMaximizeEditor}
      />
    </div>
  )
}
