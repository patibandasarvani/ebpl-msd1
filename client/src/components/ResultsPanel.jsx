import Tabs from './Tabs.jsx'

export default function ResultsPanel({ tab, onTab, result }) {
  return (
    <section className="panel right">
      <div className="panel-header">
        <h3>Compilation Results</h3>
      </div>
      <Tabs
        value={tab}
        onChange={onTab}
        items={[
          { value: 'output', label: 'Output' },
          { value: 'tokens', label: 'Tokens' },
          { value: 'gen', label: 'Generated Code' }
        ]}
      />
      <div className="result">
        {tab === 'output' && (
          <pre>{result.output || 'Output will appear here after compilation...'}</pre>
        )}
        {tab === 'tokens' && (
          <pre>{JSON.stringify(result.tokens || [], null, 2)}</pre>
        )}
        {tab === 'gen' && (
          <pre>{result.generatedCode || ''}</pre>
        )}
      </div>
    </section>
  )
}
