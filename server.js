const cors = require('cors')
const express = require('express');
const helmet = require('helmet')

const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')

const server = express();

//parsing json strigfied text from requests that come into express server into a js body
server.use(express.json())
server.use(helmet())
server.use(cors())
server.use(logger)

server.use('/api/users', userRouter)
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
    console.log(`a ${req.method} request was made to ${req.url}`)
    next()
 
}


module.exports = server;
