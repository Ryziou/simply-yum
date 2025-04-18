import mongoose, { Schema } from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
})

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    category: { type: String, required: true },
    imageUrl: { type: String, required: true},
    ingredients: { type: [ String ], required: true },
    instructions: { type: [ String ], required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    comments: [commentSchema]
}, {
    timestamps: true
})


const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe