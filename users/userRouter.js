//importing express
const express = require('express');

//importing user database as Users
const Users = require('./userDb')
const Posts = require('../posts/postDb');


//setting up router
const router = express.Router();


//POST user
router.post('/', validateUser, (req, res) => {
  const { name } = req.body

  /***** without middleware *****/
  // if(!name) {
  //   return res.status(400).json({ message: 'missing required name field'})
  // }
  // if(!req.body) {
  //   return res.status(400).json({ message: 'missing user data'})
  // }

  Users.insert({ name })
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
router.post('/:id/posts', validateUserId, validatePost,  (req, res) => {
  const { id: user_id } = req.params
  const { text } = req.body
  
  /**** without middleware  *****/
  // if(!res.body) {
  //   return res.status(400).json({ message: 'missing post data' })
  // }
  // if(!text) {
  //   return res.status(400).json({ message: 'missing required text field' })
  // }

  Posts.insert({user_id, text})
  .then(post => {
    console.log('post poat',post)
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
router.get('/:id', validateUserId, (req, res) => {
  //with middleware this request can be simplified to
  res.status(200).json(req.user)
  
  /****** without middleware ******/
  // const { id } = req.params

  // Users.getById(id)
  // .then(user => {
  //   console.log(user)
  //   if(user) {
  //   res.status(200).json(user)
  //   } else {
  //     res.status(404).json({ message: 'user not found'})
  //   }
  // })
  // .catch(error => {
  //   console.log(error)
  //   res.status(500).json({ message: 'error fetching user' })
  // })

});

//GET user posts by user id
router.get('/:id/posts', validateUserId, (req, res) => {
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

//DELETE user
router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params
  Users.remove(id)
  .then(deleted => {
    console.log(deleted)
    res.status(200).json({ message: 'user has been removed' })
  }) 
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error removing user'})
  })
});

//PUT edit user
//validateUserId as middleware 
router.put('/:id', validateUserId, (req, res) => {
  const {id } = req.params
  //destructing name from body; from Users schema
  const { name } = req.body
  
  Users.update(id, { name })
  .then(updatedUser => {
    console.log('updated user',updatedUser)
    if(updatedUser) {
      Users.getById(id)
      .then(user => res.status(200).json(user)
      )
      .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'error getting user' })
      })
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'error updating user' })
  })

  // res.status(404).json({ message: 'please make changes '})
})


//custom middleware

//checking if user with certain id exists
//if it does move on (next())
//if it doesnt, throw a 404 error
function validateUserId(req, res, next) {
  const { id } = req.params
  Users.getById(id) 
  .then(user => {
    if(user) {
      req.user = user 
      console.log(req.user)
      next() 
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  }).catch(error => {
    res.status(500).json({ message: error.message})
  })
}


//checks the body on a request to create a new user
//if the req.body is missing throw a 400 error
//if the req.body.name is missing throw a 400 error
function validateUser(req, res, next) {
  const { name } = req.body
  console.log('ffd',req.body)

  if(!req.body) {
     res.status(400).json({ message: 'missing user data'})
  } else if(!name) {
     res.status(400).json({ message: 'missing required name field'})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const { id: user_id } = req.params
  const { text } = req.body
  
  if(!req.body) {
    return res.status(400).json({ message: 'missing post data' })
  }
  if(!text) {
    return res.status(400).json({ message: 'missing required text field' })
  }

  next()
}

module.exports = router;
