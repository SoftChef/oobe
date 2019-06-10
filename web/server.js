let fs = require('fs')
let http = require('http')
let mimeTypes = {
    'js': 'text/javascript',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'css': 'text/css',
    'html': 'text/html',
    'jpeg': 'image/jpeg'
}
let ip = '127.0.0.1'
let now = '/'
let port = 3000
let path = `http://${ip}:${port}`

let server = http.createServer(function(req, res) {
    let url = req.url
    let ext = url.split('.').pop()
    let contentType = mimeTypes[ext] || 'text/html'
    if (url === '/' || !url.match(/\./g)) {
        now = url.split('/').slice(0, -1).join('/')
        res.write(fs.readFileSync('./index.html', 'utf8'))
    } else {
        try {
            res.writeHeader(200, { 'Content-Type': contentType })
            res.write(fs.readFileSync('.' + url.replace(now, ''), 'utf8'))
        } catch (error) {}
    }
    res.end()
})

server.listen(port, ip)

console.log(`< ${path} >`)
