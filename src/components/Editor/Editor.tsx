import React, { useState, useEffect, useRef, useCallback } from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

import { SelectedContracts } from 'components/Playground/types'
import { UploadModal } from 'components/Modals'
import { typeContractMethods } from 'libs/contract'
import { isIOS } from 'libs/device'
import { saveLastUsedCode, getLastUsedCode } from 'libs/localstorage'
import { setBeforeUnload } from 'libs/beforeUnload'
import { getEditorTypes, getDefaultScript } from './editorTypes'
import { Props } from './types'

import './Editor.css'
import { injectGlobals } from 'libs/global'

export const OUTPUT_HEADLINE = '/***** Output *****/\n'

let currentCode: string

export default function Editor(props: Props) {
  const {
    contracts,
    library,
    initCode,
    isMaximized,
    onChangeSize,
    isLoading
  } = props

  const defaultScript = getDefaultScript(library)
  const editorTypes = getEditorTypes(library)

  const [code, setCode] = useState(defaultScript)
  const [copyText, setCopyText] = useState('Copy')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const prevContracts = usePrevious(contracts)

  let monacoRef = useRef<typeof monacoEditor | null>(null)
  let textareaRef: HTMLTextAreaElement

  // Hack to make Monaco editor addCommand works
  currentCode = code

  const instanceWindowVars = useCallback(
    async () => injectGlobals(library, prevContracts, contracts),
    [library, contracts, prevContracts]
  )

  function usePrevious(value: SelectedContracts) {
    const ref = useRef<SelectedContracts>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  // Did Mount
  useEffect(() => {
    let code
    if (initCode) {
      code = initCode
    } else {
      code = getLastUsedCode()
    }

    if (code) {
      setCode(code)
    }
  }, [initCode])

  useEffect(() => {
    if (monacoRef.current && !isLoading) {
      monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
        typeContractMethods(editorTypes, contracts, library),
        'index.d.ts'
      )
      instanceWindowVars()
    }
  }, [editorTypes, contracts, instanceWindowVars, library, isLoading])

  function editorWillMount(monaco: typeof monacoEditor) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      typeContractMethods(editorTypes, contracts, library),
      'index.d.ts'
    )

    monacoRef.current = monaco
    instanceWindowVars()
  }

  function editorDidMount(
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) {
    const model = editor.getModel()
    if (model && model.getModeId() === 'typescript') {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        saveLastUsedCode(currentCode)
        editor.trigger('format', 'editor.action.formatDocument', null)
      })
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handleExecuteCode
      )
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_E,
        handleExecuteCode
      )
    }
  }

  function cleanState() {
    setIsRunning(true)
    setOutput(null)
    setError(null)
  }

  async function handleExecuteCode() {
    saveLastUsedCode(currentCode)

    let output: string

    const setOutputState = (...values: any) => {
      if (output === undefined) {
        output = ''
      }

      if (values.length > 1) {
        values.forEach(
          (value: any) => (output += JSON.stringify(value, null, 2) + '\n')
        )
      } else {
        output += JSON.stringify(values[0], null, 2) + '\n'
      }

      setOutput(output)
    }

    try {
      cleanState()
      setOutputState(
        // eslint-disable-next-line
        await eval(`
       (function(){
          const console = {}

          console.log = function() {
            setOutputState(...arguments)
          }
          ${currentCode}
          return main()
        })()
      `)
      )
    } catch (e) {
      setError(e.stack)
    }
    setIsRunning(false)
  }

  function handleCodeChange(newValue: string) {
    setBeforeUnload()
    setCode(newValue)
  }

  function handleResetCode() {
    handleCodeChange(defaultScript)
  }

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

  function handleClearOutput() {
    setOutput(null)
    setError(null)
  }

  function toggleModal() {
    saveLastUsedCode(currentCode)
    setIsModalOpen(!isModalOpen)
  }

  let outputValue = OUTPUT_HEADLINE

  if (isRunning) {
    outputValue = 'Running...'
  } else if (output) {
    outputValue = output
  }

  if (error) {
    outputValue += error
  }

  return (
    <>
      <div className={`Editor ${isMaximized ? ' maximized' : ''}`}>
        <div className="code-wrapper">
          <div className="actions">
            <div className="col left">
              <button onClick={onChangeSize} title="Hide">
                {isMaximized ? (
                  <i className="icon hide" />
                ) : (
                  <i className="icon maximize" />
                )}
                {isMaximized ? 'Minimize' : 'Maximize'}
              </button>
              <button onClick={handleExecuteCode} title="Run">
                <i className="icon run" />
                {'Run'}
              </button>
              <button onClick={toggleModal} title="Upload & Share">
                <i className="icon upload" />
                {'Save & Share'}
              </button>
            </div>
            <div className="col right">
              <button onClick={handleResetCode} title="Reset">
                <i className="icon reset" />
                {'Reset'}
              </button>
            </div>
          </div>
          <MonacoEditor
            language="typescript"
            theme="vs-dark"
            value={currentCode}
            onChange={handleCodeChange}
            editorWillMount={editorWillMount}
            editorDidMount={editorDidMount}
            options={{
              automaticLayout: true,
              lineNumbers: 'off',
              minimap: { enabled: false },
              fontSize: 11
            }}
          />
        </div>
        <div className="output-wrapper">
          <div className="actions">
            <div className="col left">
              <button onClick={handleCopy} title="Copy">
                <i className="icon copy" />
                {copyText}
              </button>
            </div>
            <div className="col right">
              <button onClick={handleClearOutput} title="Clear">
                <i className="icon reset" />
                {'Clear'}
              </button>
            </div>
          </div>
          <MonacoEditor
            language="typescript"
            theme="vs-dark"
            value={outputValue}
            options={{
              readOnly: true,
              automaticLayout: true,
              lineNumbers: 'off',
              minimap: { enabled: false },
              fontSize: 10,
              folding: false
            }}
          />
        </div>
      </div>
      <textarea
        readOnly={true}
        className="no-visible"
        ref={textarea => {
          if (textarea) {
            textareaRef = textarea
          }
        }}
        value={outputValue}
      />
      {isModalOpen && <UploadModal onClose={toggleModal} />}
    </>
  )
}
