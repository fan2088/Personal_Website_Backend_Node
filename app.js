const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session) // store session in database
const connectDB = require('./config/db')
const { Mongoose } = require('mongoose')

dotenv.config({path: './config/config.env'})
require('./config/passport')(passport)
connectDB()

const app = express()
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
)

//Handlebars Helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helper/hbs')

// Use Handlebars view engine
app.engine('.hbs', exphbs({helpers: {formatDate,stripTags,truncate,editIcon,select}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//sessions
app.set('trust proxy', 1) // trust first proxy
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}) //store session in database
    }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)