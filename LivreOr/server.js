let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
const Handler = require("./models/Handler");

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

    console.log("message reçu", request.body.params)

    let Handler = require('./models/Handler')

    Handler.create(request, function (){

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
    response.writeHead(200,{"status": "ok"})
    response.end()
})

app.listen(8080)
