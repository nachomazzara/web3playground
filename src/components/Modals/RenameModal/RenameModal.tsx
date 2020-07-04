import React, { useState, useContext } from 'react'

import { renameFile } from 'libs/localstorage'
import Modal from '../Modal'
import { AppContext } from 'components/App'
import { Props } from './types'

import './RenameModal.css'

export default function RenameModal(props: Props) {
  const { file, onClose } = props
  const { refreshFiles } = useContext(AppContext)
  const [name, setName] = useState<string>(file.name)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    renameFile({ ...file, name })
    refreshFiles()
    onClose()
    setError(null)
  }

  return (
    <Modal onClose={onClose} className="RenameModal" title="Rename">
      <div className="form">
        <input value={name} onChange={e => setName(e.target.value)} />
        <button onClick={handleSave}>{'Submit'}</button>
      </div>
      {error && <p className="error">{error}</p>}
    </Modal>
  )
}
