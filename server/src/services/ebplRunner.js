export async function runEbpl(code) {
  const start = Date.now()
  const src = (code ?? '').replace(/\r\n?/g, '\n').trim()

  // Simple lexer to produce tokens
  function lex(input) {
    const tokens = []
    const re = /\s+|("[^"]*")|([A-Za-z_][A-Za-z0-9_]*)|(\d+\.?\d*)|([+\-*/%()=.:\[\]])|(==|\.|\.\.)/gy
    let m
    let i = 0
    while (i < input.length) {
      re.lastIndex = i
      m = re.exec(input)
      if (!m) { tokens.push({ type: 'char', value: input[i] }); i++; continue }
      const [match, str, ident, num, op, op2] = m
      if (/^\s+$/.test(match)) { i = re.lastIndex; continue }
      if (str) tokens.push({ type: 'string', value: str.slice(1, -1) })
      else if (ident) {
        const kw = ['for','in','print','if','elif','else','len']
        tokens.push({ type: kw.includes(ident) ? 'keyword' : 'identifier', value: ident })
      }
      else if (num) tokens.push({ type: 'number', value: num })
      else if (op2) tokens.push({ type: 'operator', value: op2 })
      else if (op) tokens.push({ type: 'operator', value: op })
      i = re.lastIndex
    }
    return tokens
  }

  // JS codegen buffer
  const js = []
  const declared = new Set()

  function genAssign(name, exprJs) {
    if (!declared.has(name)) { js.push(`let ${name} = ${exprJs};`); declared.add(name) }
    else { js.push(`${name} = ${exprJs};`) }
  }

  function genPrint(exprJs) { js.push(`console.log(${exprJs});`) }

  // Tiny permissive interpreter
  const env = Object.create(null)
  const out = []

  const safeEval = (expr, localEnv) => {
    const allowed = /^[0-9A-Za-z_\s+\-*/%().]+$/
    if (!allowed.test(expr)) return NaN
    const replaced = expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (name) => {
      if (Object.prototype.hasOwnProperty.call(localEnv, name)) return String(localEnv[name])
      return '0'
    })
    try { return Function('"use strict";return (' + replaced + ')')() } catch { return NaN }
  }

  try {
    if (!src) return makeResult('[mock] No code provided\n')
    const lines = src.split('\n')
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li].trim()
      if (!line) continue

      // for i in 1..N: <stmt>
      const mFor = line.match(/^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+1\.\.(\d+)\s*:\s*(.*)$/)
      if (mFor) {
        const it = mFor[1]
        const N = parseInt(mFor[2], 10)
        const stmt = mFor[3]
        js.push(`for (let ${it} = 1; ${it} <= ${N}; ${it}++) {`)
        for (let i = 1; i <= N; i++) {
          env[it] = i
          // support: print <expr> or print "..."
          const mPrintStr = stmt.match(/^print\s+"([^"]*)"$/)
          if (mPrintStr) { out.push(mPrintStr[1]); js.push(`  console.log(${JSON.stringify(mPrintStr[1])});`); continue }
          const mPrintExpr = stmt.match(/^print\s+(.+)$/)
          if (mPrintExpr) { const val = String(safeEval(mPrintExpr[1], env)); out.push(val); genPrint(mPrintExpr[1].replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g,'$1')); continue }
          // assignment inside loop
          const mAssign = stmt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/)
          if (mAssign) { env[mAssign[1]] = safeEval(mAssign[2], env); genAssign(mAssign[1], mAssign[2].replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g,'$1')); continue }
        }
        js.push('}')
        continue
      }

      // print "..."
      const mPrintStr = line.match(/^print\s+"([^"]*)"$/)
      if (mPrintStr) { out.push(mPrintStr[1]); genPrint(JSON.stringify(mPrintStr[1])); continue }

      // print <expr>
      const mPrintExpr = line.match(/^print\s+(.+)$/)
      if (mPrintExpr) { const val = String(safeEval(mPrintExpr[1], env)); out.push(val); genPrint(mPrintExpr[1].replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g,'$1')); continue }

      // assignment: x = expr
      const mAssign = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/)
      if (mAssign) { env[mAssign[1]] = safeEval(mAssign[2], env); genAssign(mAssign[1], mAssign[2].replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g,'$1')); continue }

      // Unparsed line -> include as comment in generated code so the tab shows something
      js.push(`// Unparsed: ${line}`)
    }

    const finalOut = out.length ? out.join('\n') + '\n' : `[mock] Received ${lines.length} line(s). No prints found. Echo:\n` + src.split('\n').slice(0, 10).join('\n') + '\n'
    return makeResult(finalOut)
  } catch (e) {
    return makeResult('[mock] Error interpreting code\n')
  }

  function makeResult(output) {
    const timeMs = Date.now() - start
    const tokens = lex(src)
    const header = '// Generated from EBPL-like input\n"use strict";'
    const body = js.length ? js : ["// (no executable statements recognized)", "console.log('EBPL mock: no-op');"]
    const generatedCode = [header, ...body].join('\n')
    return { output, tokens, generatedCode, timeMs }
  }
}
