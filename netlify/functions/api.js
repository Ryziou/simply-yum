import serverless from 'serverless-http'
import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import ejs from 'ejs'
import 'dotenv/config'
import methodOverride from 'method-override'
import session from 'express-session'
import MongoStore from 'connect-mongo'

// Routers
import homeRouter from '../../controllers/home.js'
import recipeRouter from '../../controllers/recipes.js'
import userRouter from '../../controllers/users.js'
import profileRouter from '../../controllers/profile.js'
import commentRouter from '../../controllers/comments.js'
import favouriteRouter from '../../controllers/favourites.js'

// Middleware
import passErrorToView from '../../middleware/passErrorToView.js'
import passUserToView from '../../middleware/passUserToView.js'
import dateTime from '../../middleware/dateTime.js'
import capitalizeWords from '../../middleware/capitalizeWords.js'

const app = express()
const port = process.env.PORT || 3000

app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(passErrorToView)
app.use(passUserToView)
app.use(dateTime)
app.locals.capitalizeWords = capitalizeWords

// Index
app.get('/', homeRouter)

// Routers
app.use('/', recipeRouter)
app.use('/', userRouter)
app.use('/', profileRouter)
app.use('/', commentRouter)
app.use('/', favouriteRouter)

app.get('/{*any}', (req, res) => {
    res.status(404).render('404.ejs')
})

async function startTheServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🚪 Server has been established. 🚪');
        
    } catch (error) {
        console.error(error);
        
    }
}
startTheServer()

export const handler = serverless(app)