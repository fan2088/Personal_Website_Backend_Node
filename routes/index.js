const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth') 

const story = require('../models/Story')
// Login/Landing Page

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        //.lean() makes the execution faster, it has to follow find() in mongoose: 
        const stories = await story.find({user: req.user.id}).lean() 
        res.render('dashboard', {
            name: req.user.displayName,
            stories
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

module.exports = router