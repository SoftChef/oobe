let fs = require('fs')

let t = fs.readFileSync('./version.md', 'utf8').split('##').reverse().join('##')

fs.writeFileSync('./aa.md', t)
