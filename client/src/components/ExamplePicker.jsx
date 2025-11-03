export default function ExamplePicker({ open, examples, onClose, onSelect }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Example Codes</h4>
          <button className="btn" onClick={onClose}>✖</button>
        </div>
        <ul className="example-list">
          {examples.map(ex => (
            <li key={ex.id}>
              <button className="example-item" onClick={() => onSelect(ex.id)}>
                <span className="example-title">{ex.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
