<h1 align="center">Simply Yum</h1>

## Description

This is a website built for food recipes. This was created by using EJS, CSS, and JavaScript.



## Deployment link

<link to deployment link>

## Getting Started/Code Installation

Clone this repository to your local machine. Open VSC with the folder as a main in terminal and input "nodemon" into it. Open up your web browser and go to http://localhost:3000/ to start trying it out.


## Timeframe & Working Team (Solo/Pair/Group)

This project started on 17/04/2025 and I have worked solo on this. It was completed on <date>


## Technologies Used

### Front End
    - CSS
    - JavaScript

### Back End / Development Tools
    - EJS (Express, Mongoose, Morgan, method-override, express-session, MongoDB, connect-mongo)
    - Visual Studio Code
    - Git & GitHub
    - Windows Subsystem for Linux (WSL) with Ubuntu
    - Zsh (Z Shell) + Oh My Zsh
    - Node.js & npm

### External websites used for researching or use

#### Researching & Images

[Google](https://www.google.com/)  
[MDN Web Docs](https://developer.mozilla.org/en-US/) 
[Cloudinary for image hosting](https://cloudinary.com/)
[Mongoose Docs](https://mongoosejs.com/docs/guide.html)
[Express Node.js](https://expressjs.com/en/5x/api.html)
[Code Academy](https://www.codecademy.com/)

#### Others
[MongoDB for database hosting](https://www.mongodb.com/)
[ChatGPT for Seed DB](https://chatgpt.com/)
[Netlify for serverless hosting](https://www.netlify.com/)


## Brief

### MVP (Minimum Viable Product)
- The app utilizes EJS Templates for rendering views to users.
- The app uses session-based authentication.
- The app’s files are organized following the conventions taught in lectures.
- The app has at least one data entity in addition to the User model. At least one entity must have a relationship with the User model.
- The app has full CRUD functionality.
- Authorization is implemented in the app. Guest users (those not signed in) should not be able to create, update, or delete data in the application or access functionality allowing those actions.
- The app is deployed online so that the rest of the world can use it.


## Planning
### Wireframes
#### Main

![Food Project Wireframe](https://res.cloudinary.com/dit5y4gaj/image/upload/v1744880811/a7e4e911-0da9-4ab3-8366-7d1ae1fe1ed1.png)

#### Profile

![Food Project Profile Wireframe](https://res.cloudinary.com/dit5y4gaj/image/upload/v1744880838/d7d6f940-0271-4b15-b6dc-15986a0feb2f.png)

#### CRUD

![CRUD Setup Wireframe](https://res.cloudinary.com/dit5y4gaj/image/upload/v1745570904/c1e79443-4911-4b74-b50d-672256e1eac5.png)

#### Models/Schemas

![Models/Schemas Wireframe](https://res.cloudinary.com/dit5y4gaj/image/upload/v1745570931/3961326c-937c-452b-95ab-5aac17855483.png)


## Build/Code Process

### Date & Time Formatting
I'm very happy that I decided to make a very useful middleware for myself:

```js
export default function dateTime(req, res, next) {
    res.locals.formatDate = function(dateObj) {
        const createdDate = new Date(dateObj)
        return {
            shortDate: createdDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }),
            fullDate: createdDate.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        }
    }
    next()
}
```
This little function saved me tons of time. Instead of writing multiple date formats code over and over in different places, I just used this middleware to make a ```formatDate()``` function available globally on my ejs pages.

For example, in my show.ejs page, I have done this:
```js
<p title="<%= comment.formatDate.fullDate %>"><%= comment.formatDate.shortDate %></p>
```
This shows me the shortDate and when I hover over that date, it'll show me the fullDate:

- shortDate: "April 25, 2025"
- fullDate: "April 25, 2025 at 10:20am"

No more copy pasting across the site and I can always change the date format etc by only updating one file.



## Challenges

### The CSS Battle: My Biggest Challenge

Styling this project nearly broke me! 😅 The recipe detail page was my nemesis - trying to arrange the recipe image, details regarding the author's description, favourite button, ingredients list and instructions. Basically everything in a singular recipe page was my worst nightmare.

I'm definitely not very stylistic so it took me a good amount of time to focus on this part. Thankfully, I was told by my instructor to toy with the inspector and element changes in the actual browser. This made everything easier but not too much!

After toying with the page, I'm very thankful for flexbox and grid. The grid part has overall great layout and I used flexbox for the inner components. This did make it easier to apply CSS styling to other pages of the website as well.

### Creating User Profile Navigation

One of the trickier parts of this project for me was setting up the user profile system so that visitors could view other users' profiles and see what recipes they have created or what are their most favourite recipes.

Allowing the person to view their own profile was very easy honestly but the hardest part was thinking of how to allow user A to view user B's profile.

#### The Profile Route Confusion

I started with a simple ```/profile``` route for the current user:

```js
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
```
But then! I wanted to add a way for viewing other users. I initially picked ```/profile/:userId``` but I figured that would cause too many issues.

1. Not too simple. It's hard to tell who you're viewing until you are actually at their profile to see the name
2. Feels very unsafe that people can actually see their database userid
3. I wanted the URL to be cleaner!

So I decided to go with ```/profile/:username```.

```js
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
```
What I struggled with this is that I kept running into a few problems:

1. The template needed to know if you were viewing your own profile or someone else's
2. Had to pass different variables depending on which route was triggered
3. Figuring out how to prevent users from editing or deleting others' profiles
4. Making sure the links throughout the site are pointing to the right profile URLs.

After many failed attempts and tons of console logs, I finally got it working by passing both ```profileUser``` and ```currentUser``` to the template, and then using EJS conditionals to show/hide things.

Now users can finally click on a recipe's author and check out their profiles! Small wins! 😊
<br><sub>(I did however, leave the edit/deletion routes to userid because anyone but you will be able to use those buttons anyway!)</sub>


## Wins

Honestly, the fact that I beat my challenges means those are definitely my wins. The best win I've ever succeeded in would 100% be the CSS issues I was having.


## Key Learnings/Takeaways

Choosing a food recipe website for this project was definitely the right call! Working on it helped me level up in several important areas:

- JavaScript Event Handling: Making the buttons to create and delete the ingredient/instruction sections work properly and handling the user interactions really strengthened my understand of event listeners and DOM manipulation.

- EJS Templating: Getting more comfortable with EJS templates. I now feel more aligned to dynamically generate HTML and pass data between my backend and the frontend.

- Full-Stack Integration: This project connected all the pieces - from database models to server routes to frontend rendering.

- Middleware Magic: Creating reusable middleware(like my date formatter!) showed me how to write cleaner, and more maintainable code.


## Bugs

### Silly Submission Form Bug

My most weird and silly bug that I've encountered was when trying to delete unused extra steps/ingredients made if the user clicks the button and then decides to ignore it instead of deleting it. I tried very hard to make a good code block for this and I figured this out:

```js
const recipeForm = document.querySelector('.create-recipe-form')

if (recipeForm) {
    recipeForm.addEventListener('submit', function() {

        const ingredientChecker = recipeForm.querySelectorAll('input[name="ingredients"]');
        ingredientChecker.forEach(inputChecker => {
            if (inputChecker.value.trim() === '') {
                inputChecker.parentElement.remove();
            }
        })
        const instructionChecker = recipeForm.querySelectorAll('textarea[name="instructions"]')
        instructionChecker.forEach(inputChecker => {
            if (inputChecker.value.trim() === '') {
                inputChecker.parentElement.remove()
            }
        })

    })
}
```
It will target my recipe form that creates and edit's a recipe. It would then check if the form is being submitted, if so then it will target all the ingredients and instructions newly created parent elements and then check if it has been used by trimming the text areas to nothing, and if it is nothing then it will remove the parent element so that the user can not create an insane amount of extra steps/ingredients and not use them.

I toyed with this for a good amount of time and it honestly just never worked. I kept changing the ```querySelectorAll``` parts to different classes, names, id's, divs(!?) but sadly nothing was working! I then figured I was targeting it wrong or needed to stop the form being submitted and adding a ```SetTimeout()``` to then deliver the form submission after the fields have been deleted but that wasn't really working out for me.

In the end, I messaged my instructor for help and told him what was happening. As I was waiting for a reply, I tried it again and I don't understand but it somehow magically worked fine all of a sudden. 😅

That is why it will be my silly submission form bug!


## Future Improvements

- Adding a dark mode (for dark mode users like myself!)
- The ability to search via title or category based.
- A toggleable filter button that would either put the recipes at A-Z or most favourited at the top/bottom or even both filters + more!
- Making the favourites rating actually scale based on the amount of favourites the recipe has.
- More categories or even the ability for a user to create new ones themselves so I don't have to think of every single category.
- Space out the ingredients more so they can accurately choose the amounts etc.
- If a recipe says that it only serves 1 then the user might want the ability to choose 4 servings and the ingredients would accurately change for that amount.