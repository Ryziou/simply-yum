import express from 'express'
import mongoose from 'mongoose'
import checkIfSignedIn from '../middleware/checkIfSignedIn.js'
import parser from '../middleware/parser.js'
import Recipe from '../models/recipe.js'
import User from '../models/user.js'


const router = express.Router()

router.get('/profile/:username', async (req, res, next) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })
        if (!user) return next()

        const createdRecipes = await Recipe.find({ createdBy: user._id })
        const favRecipes = await Recipe.find({ favourites: user._id })

        return res.render('users/profile.ejs', {
            createdRecipes,
            favRecipes,
            profileUser: user,
            currentUser: req.session.user
        })
    } catch (error) {
        console.log(error);

    }
})

router.get('/profile/:userId/edit', checkIfSignedIn, async (req, res, next) => {
    try {
        const { userId } = req.params

        if (!mongoose.isValidObjectId(userId)) return next()

        const user = await User.findById(userId)
        if (!user) return next()

        if (!user._id.equals(req.session.user._id)) return res.redirect(`/profile/${user._id}`)

        res.render('users/edit.ejs', {
            profileUser: user
        })
    } catch (error) {
        console.log(error);
        
    }
})

router.put('/profile/:userId', checkIfSignedIn, parser.single('avatar'), async (req, res, next) => {
    try {
        const { userId } = req.params
        if (req.file) req.body.avatar = req.file.path

        if (!mongoose.isValidObjectId(userId)) return next()

        const user = await User.findById(userId)
        if (!user) return next()
        if (!user._id.equals(req.session.user._id)) return res.status(403).send('Not Authorized')

        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 12)
        } else {
            delete req.body.password
        }
        if (req.body.username) {
            req.body.username = req.body.username.toLowerCase()
        }
        const updateUser = await User.findByIdAndUpdate(userId, req.body, { new: true })
        req.session.user = updateUser
        
        res.redirect(`/profile/${updateUser.username}`)
    } catch (error) {
        console.log(error);
        
    }
})

router.delete('/profile/:userId', checkIfSignedIn, async (req, res, next) => {
    try {
        const { userId } = req.params

        if (!mongoose.isValidObjectId(userId)) return next()

        const deleteUser = await User.findByIdAndDelete(userId)
        if (!deleteUser) return next()

        req.session.destroy(() => {
            res.redirect('/')
        })
    } catch (error) {
        console.log(error);
        
    }
})

export default router