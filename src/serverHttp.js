const http = require("http")

const server = http.createServer((req,res) =>{
    res.end("Hola servidor Http")
})

const port = 3000

server.listen(port, () =>{
    console.log(`Servidor en el puerto http://localhost:${port}`)
})
