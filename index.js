// implement your API here
require('dotenv').config();
const express = require('express');
const db  = require('./data/db');
const port = process.env.PORT || 4000;
const server = express();
server.use(express.json());

server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    
    if ( !name || !bio) {
       res.status(400).json({ 
           errorMessage: "Please provide name and bio for the user.",
        });
    } else {
        db.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "There was an error while saving the user to the database"
            });
        });
     }
});

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.',
      });
    });
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ 
            message: 'The user with the specified ID does not exist.' 
        });
      }
    })
    .catch(() => {
        res.status(500).json({ 
            errorMessage: 'The user information could not be retrieved.' 
        });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.param.id;

  db.findById(id)
  .then((user) => {
    if(user) {
      return db.remove(id);
    } else {
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist"
      })
    }
  })
  .then(() => { res.status(204).end() })
  .catch(() => { res.status(500)}).json({
    errorMessage: "The user could not be removed"
  })
});

server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;

  if (name || bio) {
    db.update(req.params.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ 
            errorMessage: "The user doesn't exist with that ID" 
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          errorMessage: "The user couldn't be updated" 
        });
      });
  } else {
    res.status(400).json({ errorMessage: 
      "Please provide name and bio for the user" 
    });
  }
});

server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});