// code away
const server = require('./server.js')
const port = 6000



server.listen(port, () => {
    console.log(`Server running on http://localhost${port}`)
})



