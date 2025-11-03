export default function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs">
      {items.map(it => (
        <button key={it.value}
          className={value === it.value ? 'active' : ''}
          onClick={() => onChange(it.value)}>
          {it.label}
        </button>
      ))}
    </div>
  )
}
