// code away
const server = require('./server.js')
const port = process.env.PORT || 6000


server.listen(port, () => {
    console.log(`Server running on port http://localhost${port}`)
})



