import React, { useState, useEffect, useCallback, useContext } from 'react'

import { isIOS } from 'libs/device'
import { upload, normalizeIPFSHash } from 'libs/ipfs'
import { saveFile } from 'libs/localstorage'
import Modal from '../Modal'
import { AppContext } from 'components/App'
import { Props } from './types'

import './UploadModal.css'

export default function UploadModal(props: Props) {
  const { refreshFiles } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const [hash, setHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyText, setCopyText] = useState('Copy')
  let textareaRef: HTMLTextAreaElement

  function handleCopy() {
    setCopyText('Copied')

    if (isIOS()) {
      const range = document.createRange()
      range.selectNodeContents(textareaRef)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textareaRef.setSelectionRange(0, 999999)
    } else {
      textareaRef.select()
    }

    document.execCommand('copy')

    window.setTimeout(() => setCopyText('Copy'), 1000)
  }

  const handleUpload = useCallback(async () => {
    setIsLoading(true)
    const { IpfsHash, error } = await upload()
    if (error) {
      setHash(null)
      setError(error)
    } else {
      setHash(IpfsHash)
      const file = normalizeIPFSHash(IpfsHash!)
      saveFile(file)
      refreshFiles(file)
      setError(null)
    }
    setIsLoading(false)
  }, [refreshFiles])

  useEffect(() => {
    handleUpload()
  }, [handleUpload])

  const hashLink = `${window.location.origin}/${hash}`

  return (
    <Modal onClose={props.onClose} className="UploadModal" title="Share">
      {isLoading && <p>Uploading...</p>}
      {hash && (
        <div>
          <p>{hashLink}</p>
          <textarea
            readOnly={true}
            className="no-visible"
            ref={textarea => {
              if (textarea) {
                textareaRef = textarea
              }
            }}
            value={hashLink}
          />
          <button onClick={handleCopy}>{copyText}</button>
        </div>
      )}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button onClick={handleUpload}>Try again</button>
        </div>
      )}
    </Modal>
  )
}
