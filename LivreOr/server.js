let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
const Handler = require("./models/Handler");



const users = []

// Moteur de template
app.set('view engine', 'ejs')

//MiddleWare
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(express.json())

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(require('./middleware/flash'))

// Routes
app.get('/users', (request, response) => {

    res.json(users)
    // console.log(request.body)
    // console.log(request.session)
    // response.render('pages/index', {test: 'Salut'})
})

app.post('/', (request,response) => {

    console.log("message reçu", request.body.params)

    //let Handler = require('./models/Handler')
    let request_type = request.body.request
    console.log("A request of type : ", request_type, " as been received")

    switch (request_type) {
        case 'login':
              Handler.login(request.body.params, function (resp){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(resp))
            })

            break;
        case 'update':
            console.log("updating", request.body.params)
            Handler.update(request.body.params, function (user_list){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(user_list))
            })
            break;

       case 'create_event':
                    //Handler.update(request, function (){
                        // response.writeHead(200,result)
                        // response.end()
                    //})
                    break;
        case 'create_account':
            Handler.create_account(request.body.params, function (status){
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(status))
            })
            break;

        default:
            console.log("this request isn't recognized");
    }

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

console.log('server is running on port 8080')
console.log('cleaning dynamic tables')
Handler.empty_dynamic_tables()

app.listen(8080)
