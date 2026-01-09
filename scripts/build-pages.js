import fs from 'fs'
import path from 'path'

const outDir = path.resolve('dist')

// FORCE the output folder to exist
fs.mkdirSync(outDir, { recursive: true })

// SIMPLE guaranteed page
const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Infinity Spark</title>
</head>
<body>
  <h1>Infinity Spark is Live</h1>
  <p>This page was generated at build time.</p>
  <p>No backend. No API. No runtime failure.</p>
</body>
</html>
`

fs.writeFileSync(path.join(outDir, 'index.html'), html)

console.log('✅ dist/index.html written successfully')
