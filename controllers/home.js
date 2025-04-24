import express from 'express'
import mongoose from 'mongoose'
import Recipe from '../models/recipe.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const favRecipes = await Recipe.find({ favourites: { $ne: [] }}).sort({ favourites: -1 })
        res.render('index.ejs', {
            favRecipes
        })
    } catch (error) {
        console.error(error);
    }
})


export default router