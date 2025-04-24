import mongoose from 'mongoose'
import express from 'express'
import Recipe from '../models/recipe.js'
import parser from '../middleware/parser.js'
import checkIfSignedIn from '../middleware/checkIfSignedIn.js'

const router = express.Router()

// index
router.get('/recipes', async (req, res) => {
    try {
        const allRecipes = await Recipe.find()
        res.render('recipes/index.ejs', {
            allRecipes
        })
    } catch (error) {
        console.error(error);
    }
})

// new
router.get('/recipes/new', checkIfSignedIn, (req, res) => {
    try {
        res.render('recipes/new.ejs')
    } catch (error) {
        console.error(error);
    }
})


// edit
router.get('/recipes/:recipeId/edit', checkIfSignedIn, async (req, res, next) => {
    try {
        const { recipeId } = req.params

        if (!mongoose.isValidObjectId(recipeId)) return next()

        const recipe = await Recipe.findById(recipeId)
        if (!recipe) return next()

        if (!recipe.createdBy.equals(req.session.user._id)) return res.redirect(`/recipes/${recipe._id}`)

        res.render('recipes/edit.ejs', {
            recipe
        })
    } catch (error) {
        console.log(error);
        
    }
})

// show
router.get('/recipes/:recipeId', async (req, res, next) => {
    try {
        const { recipeId } = req.params

        if (!mongoose.isValidObjectId(recipeId)) return next()

        const recipe = await Recipe.findById(recipeId).populate('createdBy').populate('comments.createdBy')
        if (!recipe) return next()

        recipe.formatDate = res.locals.formatDate(recipe.createdAt)
        recipe.comments.forEach(comment => {
            comment.formatDate = res.locals.formatDate(comment.createdAt);
          });

        res.render('recipes/show.ejs', {
            recipe
        })
    } catch (error) {
        console.error(error);
        
    }
})


// create
router.post('/recipes', checkIfSignedIn, parser.single('imageUrl'), async (req, res) => {
    try {
        req.body.imageUrl = req.file.path
        req.body.createdBy = req.session.user._id

        const newRecipe = await Recipe.create(req.body)
        res.status(201).redirect(`/recipes/${newRecipe._id}`)
    } catch (error) {
        console.log(error);
        
    }
})


// update
router.put('/recipes/:recipeId', checkIfSignedIn, parser.single('imageUrl'), async (req, res, next) => {
    try {
        const { recipeId } = req.params
        if (req.file) req.body.imageUrl = req.file.path

        if (!mongoose.isValidObjectId(recipeId)) return next()

        const recipe = await Recipe.findById(recipeId)
        if (!recipe) return next()
        if (!recipe.createdBy.equals(req.session.user._id)) return res.status(403).send('Not Authorized')

        await Recipe.findByIdAndUpdate(recipeId, req.body)
        
        res.redirect(`/recipes/${recipeId}`)
    } catch (error) {
        console.log(error);
        
    }
})


// delete
router.delete('/recipes/:recipeId', checkIfSignedIn, async (req, res, next) => {
    try {
        const { recipeId } = req.params

        if (!mongoose.isValidObjectId(recipeId)) return next()

        const deleteRecipe = await Recipe.findByIdAndDelete(recipeId)
        if (!deleteRecipe) return next()

        res.redirect('/recipes')
    } catch (error) {
        console.log(error);
        
    }
})


// ! Favourites

router.post('/recipes/:recipeId/fav', checkIfSignedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
        const favourited = recipe.favourites.find(userId => userId.equals(req.session.user._id))

        if (!favourited) {
            recipe.favourites.push(req.session.user._id)
        }

        await recipe.save()

        return res.redirect(`/recipes/${recipe._id}`)
    } catch (error) {
        console.log(error);
        
    }
})

router.delete('/recipes/:recipeId/fav', checkIfSignedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
        const favourited = recipe.favourites.find(userId => userId.equals(req.session.user._id))

        if (favourited) {
            recipe.favourites.pull(req.session.user._id)
        }

        await recipe.save()

        return res.redirect(`/recipes/${recipe._id}`)
    } catch (error) {
        console.log(error);
        
    }
})

export default router