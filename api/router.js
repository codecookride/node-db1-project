const express = require('express');

// Almost there... take a peek at ./data/db-config.js...
const db = require('../data/dbConfig');

const router = express.Router();


router.get('/', async (req, res) => {
 
    try {
        const accounts = await db('accounts');
        res.json(accounts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error retrieving accounts", err });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const acc = await db.select('*').from('accounts').where({ id }).first();
        if (acc) {
            res.status(200).json(acc);
        } else {
            res.status(400).json({ message: "Post not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "sorry, ran into an error" });
    }
});

router.post('/', async (req, res) => {
    const postData = req.body;

    try {
        const post = await db.insert(postData).into('accounts');
        res.status(201).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'db problem', error: err });
    }


});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('accounts').where({ id }).update(changes)
        .then(count => {
            if (count) {
                res.status(200).json({ updated: count });
            } else {
                res.status(404).json({ message: 'invalid id' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'db problem' });
        });


});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await db.del().from('accounts').where({ id });
        count ? res.status(200).json({ deleted: count })
            : res.status(404).json({ message: 'invalid id' });
    } catch (err) {
        res.status(500).json({ message: 'database error', error: err });
    }


});

module.exports = router;