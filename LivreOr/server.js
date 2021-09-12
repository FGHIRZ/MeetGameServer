let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
const Message = require("./models/message");

// Moteur de template
app.set('view engine', 'ejs')

//MiddleWare
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(require('./middleware/flash'))

// Routes
app.get('/', (request, response) => {
    console.log(request.body)
    console.log(request.session)
    // response.render('pages/index', {test: 'Salut'})
})

app.post('/', (request,response) => {

    let Message = require('./models/message')

    Message.create(request, function (){
    console.log("message reçu", request.body.params)


    })

    // if (request.body === undefined || request.body.message === ''){
    //
    //     // request.flash('error', "Vous n'avez pas posté de message")
    //     // response.redirect('/')
    //
    // }else{
    //     let Message = require('./models/message')
    //
    //     Message.create(request.body, function (){
    //         console.log("message reçu", request.body)
    //         // request.flash('succes', "Merci !")
    //         // response.redirect('/')   <
    //     })
    // }

})

app.listen(8080)
