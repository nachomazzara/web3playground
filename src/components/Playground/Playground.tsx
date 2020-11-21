import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback
} from 'react'

import Loader from 'components/Loader'
import Editor from 'components/Editor'
import { findABIForProxy, getContract, buildContract } from 'libs/contract'
import {
  saveLastUsedContracts,
  getLastUsedContracts,
  getLastUsedNetwork,
  saveLastUsedLibrary,
  getLastUsedLibrary
} from 'libs/localstorage'
import { omit, filter } from 'libs/utils'
import { resolveHash } from 'libs/ipfs'
import { useNetwork, getNetworkNameById } from 'libs/web3'
import { LIB } from '../../constants'
import {
  Props,
  SelectedContracts,
  SelectedContract,
  SelectedContractError,
  ABI
} from './types'

import './Playground.css'

export default function Playground(props: Props) {
  const { fileId, isMaximized, handleToggleMaximizeEditor } = props

  const [loading, setLoading] = useState(0)
  const [contracts, setContracts] = useState<SelectedContracts>({})
  const [code, setCode] = useState(null)
  const [network, setNetwork] = useState<string>()
  const [error, setError] = useState<{ message: string; hash: string }>()
  const [library, setLibrary] = useState(getLastUsedLibrary())
  const isInitialMount = useRef(true)

  const currentNetwork = useNetwork()
  const isLoading = !!loading

  const handleLoading = useCallback((shouldLoad: boolean) => {
    setLoading(loading => (shouldLoad ? loading + 1 : loading - 1))
  }, [])

  const getContractInstance = useCallback(
    async (contract: SelectedContract, library: LIB) => {
      handleLoading(true)

      let instance = null
      let error: SelectedContractError = null

      if (contract.isProxy) {
        const implementationAddress = await findABIForProxy(contract.address)
        if (implementationAddress) {
          instance = await getContract(
            implementationAddress,
            library,
            contract.address
          )
        }
      } else {
        instance = await getContract(contract.address, library)
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

      handleLoading(false)

      return { instance, error }
    },
    [handleLoading]
  )

  const loadContracts = useCallback(
    async (lastUsedContracts: SelectedContract[], library: LIB) => {
      const newContracts = {}
      for (let i = 0; i < lastUsedContracts.length; i++) {
        const contract = lastUsedContracts[i]
        const { instance, error } = await getContractInstance(contract, library)

        newContracts[contract.address] = {
          ...contract,
          abi: instance ? instance.abi : null,
          instance: instance ? instance.contract : null,
          error
        }
      }

      setContracts(newContracts)
    },
    [getContractInstance]
  )

  const reloadContracts = useCallback(
    async (library: LIB) => {
      handleLoading(true)

      const newContracts = {}
      for (const address in contracts) {
        const contract = contracts[address]
        const instance = await buildContract(library, contract.abi, address)

        newContracts[contract.address] = {
          ...contract,
          instance,
          error: null
        }
      }

      setContracts(newContracts)
      handleLoading(false)
    },
    [contracts, handleLoading]
  )

  const setPlaygroundByIPFS = useCallback(
    async (hash: string) => {
      handleLoading(true)
      try {
        const data = await resolveHash(hash)
        const lib = data.library || LIB.WEB3

        setLibrary(lib)

        if (data.contracts) {
          await loadContracts(data.contracts, lib)
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

      handleLoading(false)
    },
    [loadContracts, handleLoading]
  )

  useEffect(() => {
    if (currentNetwork) {
      const paths = window.location.pathname.split('/').splice(1)
      const hash = paths[0]
      if (hash) {
        setPlaygroundByIPFS(hash)
      } else {
        const lastUsedContracts = getLastUsedContracts()
        const lastUsedNetwork = getLastUsedNetwork()

        if (lastUsedContracts) {
          setNetwork(getNetworkNameById(lastUsedNetwork))
          loadContracts(lastUsedContracts as SelectedContract[], library)
        }
      }
    }
    // I'm sorry but library is a weird thing and I don't have more time. I failed you
    // eslint-disable-next-line
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

      const { instance, error } = await getContractInstance(
        newContract,
        library
      )

      setContracts({
        ...omit(contracts, prevValue),
        [newContract.address]: {
          ...newContract,
          instance: instance ? instance.contract : null,
          abi: instance ? instance.abi : [],
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

    const { instance, error } = await getContractInstance(newContract, library)

    setContracts({
      ...contracts,
      [newContract.address]: {
        ...newContract,
        instance: instance ? instance.contract : null,
        abi: instance ? instance.abi : [],
        error
      }
    })
  }

  async function handleABIChange(event: React.FormEvent<any>) {
    event.preventDefault()

    const newContract = fillSelectedContract(event)
    newContract.isProxy = false

    if (event.currentTarget.value.length) {
      let instance = null
      let error = null
      let abi = event.currentTarget.value

      try {
        instance = await buildContract(library, abi, newContract.address)
      } catch (e) {
        error = e.message
      }

      setContracts({
        ...contracts,
        [newContract.address]: {
          ...newContract,
          abi,
          instance,
          error
        }
      })
    } else {
      const { instance, error } = await getContractInstance(
        newContract,
        library
      )
      setContracts({
        ...contracts,
        [newContract.address]: {
          ...newContract,
          instance: instance ? instance.contract : null,
          abi: instance ? instance.abi : [],
          error
        }
      })
    }
  }

  function handleRemoveContract(address: string) {
    setContracts(omit(contracts, address))
  }

  function handleChangeLibrary(library: LIB) {
    handleLoading(true)

    setLibrary(library)
    saveLastUsedLibrary(library)

    reloadContracts(library)

    handleLoading(false)
  }

  function renderContract(contract?: SelectedContract) {
    let address: string | undefined
    let name: string | undefined
    let error: SelectedContractError | undefined
    let abi: ABI | undefined

    if (contract) {
      address = contract.address
      name = contract.name
      error = contract.error
      abi = contract.abi
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
          <input
            name="abi"
            type="text"
            placeholder="ABI (optional)"
            value={abi ? abi.toString() : ''}
            onChange={e => handleABIChange(e)}
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
            {'Upgradable contract using a proxy pattern'}{' '}
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
          <div>
            <h1>{`${library.toLowerCase()} Playground`}</h1>
            {library !== LIB.WEB3 && (
              <button onClick={() => handleChangeLibrary(LIB.WEB3)}>
                Switch to Web3
              </button>
            )}
            {library !== LIB.ETHERS && (
              <button onClick={() => handleChangeLibrary(LIB.ETHERS)}>
                Switch to Ethers
              </button>
            )}
          </div>
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
      <Editor
        contracts={filter(
          contracts,
          (contract: SelectedContract) => !contract.error
        )}
        initCode={code}
        isMaximized={isMaximized}
        onChangeSize={handleToggleMaximizeEditor}
        library={library}
        isLoading={isLoading && !!currentNetwork}
      />
    </div>
  )
}
