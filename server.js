import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import ejs from 'ejs'
import 'dotenv/config'
import methodOverride from 'method-override'
import session from 'express-session'
import MongoStore from 'connect-mongo'

// Routers
import recipeRouter from './controllers/recipes.js'
import userRouter from './controllers/users.js'
import profileRouter from './controllers/profile.js'
import commentRouter from './controllers/comments.js'

// Middleware
import passErrorToView from './middleware/passErrorToView.js'
import passUserToView from './middleware/passUserToView.js'
import dateTime from './middleware/dateTime.js'


const app = express()
const port = process.env.PORT

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


app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user
    })
})
app.use('/', profileRouter)
app.use('/', userRouter)
app.use('/', commentRouter)
app.use('/', recipeRouter)



app.get('/{*any}', (req, res) => {
    res.status(404).render('404.ejs')
})

async function startTheServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🚪 Server has been established. 🚪');
        
        app.listen(port, () => console.log('🚄 Server has started!')
        )
    } catch (error) {
        console.error(error);
        
    }
}
startTheServer()