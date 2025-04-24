import express from 'express'
import mongoose from 'mongoose'
import Recipe from '../models/recipe.js'
import checkIfSignedIn from '../middleware/checkIfSignedIn.js'

const router = express.Router()

router.get('/recipes/favourite', checkIfSignedIn, async (req, res, next) => {
    try {
        const favRecipes = await Recipe.find({ favourites: req.session.user._id })
        res.render('recipes/favourite.ejs', {
            user: req.session.user,
            favRecipes
        })
    } catch (error) {
        console.error(error);
    }
})


export default router