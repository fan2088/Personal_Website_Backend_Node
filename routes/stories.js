const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth') 

const Story = require('../models/Story')

//show add page
router.get('/add', ensureAuth, (req, res) => {
    res.render('story/add')
})

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
                    .populate('user')
                    .lean()
        
        if (!story) {
            return res.render('error/404')
        }
        res.render('story/show', {
            story
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)    //create a new story
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
                            .populate('user')
                            .sort({createdAt: 'desc'})
                            .lean()
        res.render('story/index', {
            stories
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({_id: req.params.id}).lean()
        if (!story) {
            return res.render('error/404')
        }
    
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('story/edit', story)
        }
    } catch {
        console.error(error)
        return res.render('error/500')
    }
})

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.param.id).lean()
        if (!story) {
            return res.render('error/404')
        }
    
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({_id: req.param.id}, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch {
        console.error(error)
        return res.render('error/500')
    }
})

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('story/index', {
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router