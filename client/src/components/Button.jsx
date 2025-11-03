export default function Button({ kind = 'primary', children, ...props }) {
  return (
    <button className={`btn btn-${kind}`} {...props}>{children}</button>
  )
}
