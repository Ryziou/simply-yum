import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import parser from '../middleware/parser.js'
import checkIfSignedOut from '../middleware/checkIfSignedOut.js'

const router = express.Router()

router.get('/auth/sign-up', checkIfSignedOut, (req, res) => {
    try {
        return res.render('auth/sign-up.ejs')
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/auth/sign-in', checkIfSignedOut, (req, res) => {
    try {
        return res.render('auth/sign-in.ejs')
    } catch (error) {
        console.log(error);
        
    }
})

router.post('/auth/sign-in', checkIfSignedOut, async (req, res) => {
    try {   
        const identity = req.body.identity.toLowerCase()
        const findUser = await User.findOne( identity.includes('@') ? { email: identity} : { username: identity });
        if (!findUser) return res.status(401).render('auth/sign-in.ejs', {
            errorMessage: 'User does not exist.'
        })

        if (!bcrypt.compareSync(req.body.password, findUser.password)) {
            return res.status(401).render('auth/sign-in.ejs', {
                errorMessage: 'Unauthorized'
            })
        }
        req.session.user = {
            username: findUser.username,
            email: findUser.email,
            _id: findUser._id,
            avatar: findUser.avatar
        }

        req.session.save(() => {
            res.redirect('/recipes')
        })

    } catch (error) {
        console.log(error);
        
    }
})

router.post('/auth/sign-up', checkIfSignedOut, parser.single('avatar'), async (req, res) => {
    try {
        if (req.file) {
            req.body.avatar = req.file.path
        }
        
        if (req.body.password !== req.body.passwordChecker) {
            return res.status(422).render('auth/sign-up.ejs', {
                errorMessage: 'Your passwords do not match!'
            })
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12)

        req.body.username = req.body.username.toLowerCase()
    
        await User.create(req.body)

        return res.redirect('/auth/sign-in')
    } catch (error) {
        if (error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0]

            return res.status(409).render('auth/sign-up.ejs', {
                errorMessage: `That ${fieldName} already exists.`
            })
        }
        return res.status(400).render('auth/sign-up.ejs', {
            errorMessage: 'Something went wrong. Please try again.'
        })
        
    }
})

router.get('/auth/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

export default router