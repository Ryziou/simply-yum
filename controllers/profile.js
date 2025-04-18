import express from 'express'
import checkIfSignedIn from '../middleware/checkIfSignedIn.js'
import Recipe from '../models/recipe.js'
import User from '../models/user.js'


const router = express.Router()

router.get('/profile', checkIfSignedIn, async (req, res, next) => {
    try {
        const createdRecipes = await Recipe.find({ createdBy: req.session.user._id })
        const favRecipes = await Recipe.find({ favourites: req.session.user._id })
        return res.render('users/profile.ejs', {
            createdRecipes,
            favRecipes
        })
    } catch (error) {
        console.log(error);

    }
})

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

export default router