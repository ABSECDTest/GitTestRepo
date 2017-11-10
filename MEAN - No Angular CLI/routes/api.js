const express = require('express');
const router = express.Router(); //HTTP requests
const MongoClient = require('mongodb').MongoClient; //MongoClient object.  No need to setup models for mongoose.
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://joseph-test:joseph12345@ds042607.mlab.com:42607/testdb1', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

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


//HTTP GET
// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                //response.data = users;
                res.json(users);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;

