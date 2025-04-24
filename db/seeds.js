import mongoose from 'mongoose'
import 'dotenv/config'

import User from '../models/user.js'
import Recipe from '../models/recipe.js'


// Seed Data
import recipeData from './data/recipes.js'
import userData from './data/users.js'

async function seedData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB Established')

        // Remove existing data from the database collections
        const deletedUsers = await User.deleteMany()
        console.log(`${deletedUsers.deletedCount} users have been deleted`);

        const deletedRecipes = await Recipe.deleteMany()
        console.log(`${deletedRecipes.deletedCount} recipes have been deleted`);
        
        // Creating new users
        const users = await User.create(userData)
        console.log(`${users.length} users have been added to the db`);
        
        // Use the new user's _id fields to add an author to the recipe and comments
        const recipeWithCreators = recipeData.map((recipe) => {
            recipe.createdBy = users[Math.floor(Math.random() * users.length)]._id
            recipe.comments = recipe.comments.map((comment) => {
                comment.createdBy = users[Math.floor(Math.random() * users.length)]._id
                return comment
            })
            recipe.favourites = Array.from(new Set (Array.from({ length: Math.floor(Math.random() * 20) + 1}, () =>
            users[Math.floor(Math.random() * users.length)]._id)))
            return recipe
        })

        // Create the recipes with comments
        const recipes = await Recipe.create(recipeWithCreators)
        console.log(`${recipes.length} recipes have been added to the db`);
        

        // Close the connection to MongoDB
        await mongoose.connection.close()

    } catch (error) {
        console.log(error);
        // Close the connection to MongoDB
        await mongoose.connection.close()
    }
}

seedData()