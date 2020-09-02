//importing express
const express = require('express');

//importing user database as Users
const Users = require('./userDb')
const Posts = require('../posts/postDb');
const { del } = require('../data/dbConfig');

//setting up router
const router = express.Router();


//POST user
router.post('/', (req, res) => {
  const newUser = req.body
  Users.insert(newUser)
  .then(user => {
    console.log(user)
    res.status(201).json(user)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error adding new user' })
  })

});

//POST add post by user id
router.post('/:id/posts', (req, res) => {
  const userPosts = { ...req.body, user_id: req.params.id }
  Posts.insert(userPosts)
  .then(post => {
    console.log(post)
    res.status(201).json(post)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error adding post'})
  })
});

//GET all users 
router.get('/', (req, res) => {
  Users.get()
  .then(users => {
    console.log(users)
    res.status(200).json(users)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error fetching users' })
  }) 
});

//GET users by id
router.get('/:id', (req, res) => {
  const { id } = req.params
  Users.getById(id)
  .then(user => {
    console.log(user)
    if(user) {
    res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'user not found'})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error fetching user' })
  })

});

//GET user posts by user id
router.get('/:id/posts', (req, res) => {
  const { id } = req.params
  Users.getUserPosts(id)
  .then(userPosts => {
    console.log(userPosts)
    if(userPosts.length > 0) {
      res.status(200).json(userPosts)
    } else {
      res.status(404).json({ message: 'user has no posts' })
    }
  }) 
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: "error fetching user's posts" })
  })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Users.remove(id)
  .then(deleted => {
    console.log(deleted)
    if(deleted > 0) {
    res.status(200).json({ message: 'user has been removed' })
    } else {
      res.status(404).json({ message: 'user could not be found '})
    }
  }) 
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error removing user'})
  })
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  if(id) {
    next()
  } else {
    res.status(400).json({ message: 'invalid user id'})
  }
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
