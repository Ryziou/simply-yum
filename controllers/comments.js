import express from 'express'
import mongoose from 'mongoose'
import Recipe from '../models/recipe.js'
import checkIfSignedIn from '../middleware/checkIfSignedIn.js'

const router = express.Router()

router.post('/recipes/:recipeId/comments', checkIfSignedIn, async (req, res, next) => {
    try {
        req.body.createdBy = req.session.user._id
        
        const recipe = await Recipe.findById(req.params.recipeId)

        if (!recipe) return next()

        recipe.comments.push(req.body)
        await recipe.save()

        return res.redirect(`/recipes/${recipe._id}`)
    } catch (error) {
        return res.status(400).render('recipes/show.ejs', {
            errorMessage: error.message
        })
        
    }
})

router.delete('/recipes/:recipeId/comments/:commentId', checkIfSignedIn, async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
        if (!recipe) return next()

        const comment = recipe.comments.id(req.params.commentId)
        if (!comment.createdBy.equals(req.session.user._id)) {
            return res.status(403).send('Unauthorized', {
                errorMessage: error.message
            })
        }
        comment.deleteOne()
        await recipe.save()

        return res.status(200).redirect(`/recipes/${recipe._id}`)
    } catch (error) {
        return res.status(400).render('recipes/show.ejs', {
            errorMessage: error.message
        })
    }
})

export default router