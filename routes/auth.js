const express = require('express')
const passport = require('passport')
const router = express.Router()

// Login/Landing Page

router.get('/google', passport.authenticate('google', {scope: ['profile']}))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'}), (req, res) => {
        res.redirect('/dashboard')
    }
)

router.get('/logout', (req, res) => {
    req.logOut()
    req.redirect('/')
})

module.exports = router