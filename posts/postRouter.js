const express = require('express');

const Posts = require('./postDb')


const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
  .then(posts => {
    console.log('posts', posts)
    res.status(200).json(posts)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: 'error fetching posts'})
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
  
  /***** without middleware  *****/
  // const { id } = req.params
  // Posts.getById(id)
  // .then(post => {
  //   console.log(post)
  //   res.status(200).json(post)
  // })
  // .catch(error => {
  //   console.log(error)
  //   res.status(500).json({ message: 'error fetching post'})
  // })
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params
  Posts.getById(id)
  .then(post => {
    if(post) {
      req.post = post
      next()
    } else {
      res.status(404).json({ message: 'post not found'})
    }
  })
  .catch(error => {
    res.status(500).json({ message: error.message })
  })

}

module.exports = router;
