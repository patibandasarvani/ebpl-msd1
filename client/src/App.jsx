import { useState } from 'react'
import { compileRun, getExamples, getExample } from './api.js'
import Header from './components/Header.jsx'
import EditorPanel from './components/EditorPanel.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import ExamplePicker from './components/ExamplePicker.jsx'

export default function App() {
  const [code, setCode] = useState('print "Hello, EBPL World!"')
  const [tab, setTab] = useState('output')
  const [result, setResult] = useState({ output: '', tokens: [], generatedCode: '' })
  const [loading, setLoading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [exampleList, setExampleList] = useState([])

  async function onRun() {
    setLoading(true)
    try {
      const res = await compileRun(code)
      setResult(res)
      setTab('output')
    } catch (e) {
      setResult({ output: 'Error running code', tokens: [], generatedCode: '' })
    } finally {
      setLoading(false)
    }
  }

  async function onExamples() {
    const list = await getExamples()
    setExampleList(list)
    setPickerOpen(true)
  }

  function onClear() {
    setCode('')
    setResult({ output: '', tokens: [], generatedCode: '' })
  }

  return (
    <div className="page">
      <Header />
      <main className="container">
        <EditorPanel
          code={code}
          onChange={setCode}
          onRun={onRun}
          onExamples={onExamples}
          onSave={() => { /* wire later */ }}
          onClear={onClear}
          loading={loading}
        />
        <ResultsPanel tab={tab} onTab={setTab} result={result} />
      </main>
      <ExamplePicker
        open={pickerOpen}
        examples={exampleList}
        onClose={() => setPickerOpen(false)}
        onSelect={async (id) => {
          const ex = await getExample(id)
          setCode(ex.code)
          setPickerOpen(false)
        }}
      />
    </div>
  )
}
