const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function compileRun(code) {
  const res = await fetch(`${API_URL}/api/compile-run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  if (!res.ok) throw new Error('compile-run failed')
  return res.json()
}

export async function getExamples() {
  const res = await fetch(`${API_URL}/api/examples`)
  return res.json()
}

export async function getExample(id) {
  const res = await fetch(`${API_URL}/api/examples/${id}`)
  return res.json()
}
