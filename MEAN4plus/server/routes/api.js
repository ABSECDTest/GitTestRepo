const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://joseph-test:joseph12345@ds042607.mlab.com:42607/testdb1', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                //response.data = users;
                res.send(users);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get user by Id
router.get('/users/id', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find({"name": req.query.name, "location": req.query.location})
            .toArray()
            .then((users) => {
                res.send(users);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});



// Create users
router.post('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .save({name: req.body.name, location: req.body.location}, {w: "majority", wtimeout: 20000})
            .then((wresult) => {
                res.send(wresult);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Delete users
router.delete('/users/:_id', (req, res) => {
    console.log(req.params._id);
    var id = JSON.stringify(req.params);
    var query = {_id: "ObjectID("+req.params._id+")"}
    var mongodb = require('mongodb');
    console.log(query);
    connection((db) => {
        db.collection('users')
            .remove({_id: new mongodb.ObjectID(req.params._id)})
            .then((wresult) => {
                res.send(wresult);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});


module.exports = router;