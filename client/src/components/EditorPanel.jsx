import Button from './Button.jsx'

export default function EditorPanel({ code, onChange, onRun, onExamples, onSave, onClear, loading }) {
  return (
    <section className="panel left">
      <div className="panel-header">
        <h3>EBPL Code Editor</h3>
      </div>
      <textarea value={code} onChange={e => onChange(e.target.value)} spellCheck={false} />
      <div className="actions">
        <Button kind="primary" onClick={onRun} disabled={loading}>{loading ? 'Running...' : 'Compile & Run'}</Button>
        <Button kind="teal" onClick={onExamples}>Example Codes</Button>
        <Button kind="green" onClick={onSave}>Save Snippet</Button>
        <Button kind="amber" onClick={onClear}>Clear All</Button>
      </div>
    </section>
  )
}
