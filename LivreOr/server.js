let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
const Handler = require("./models/Handler")
const token_manager = require("./tokens");



const users = []
const skinFolder = './public/skins'
const eventFolder = './public/events'
const fs = require('fs')

// Moteur de template
app.set('view engine', 'ejs')

//MiddleWare
app.use('/assets', express.static('public'))
app.use(express.static('public'))
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

app.post('/login', (request, response) => {
  let request_type = request.body.request
  if(request_type=='login')
  {
    console.log("Login request received")
    Handler.login(request.body.params, function (resp){
      console.log("sending back : ", resp)
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(resp))
      console.log("renvoi : ", JSON.stringify(resp))
    })
  }
})

app.post('/manage_account', (request, response)=>{

  let request_type = request.body.request
  switch (request_type) {
      case 'create_account':
          console.log("Account creation request received")
          Handler.create_account(request.body.params, function (status){
              console.log("sending : ", JSON.stringify(status))
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;

      case 'delete_account':
          console.log("Account deletion request received")
          Handler.delete_account(request.body.params, function (status){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;
        }
})

app.post('/app', token_manager.authenticateToken, (request,response) => {

  console.log("received request : ", request.body.params)

  //let Handler = require('./models/Handler')
  let request_type = request.body.request
  console.log("A request of type : ", request_type, " has been received")

  switch (request_type) {


    case 'get_my_info':
        Handler.get_my_info(request.body.params, function (user_info){
          response.setHeader('Content-Type', 'application/json');
          console.log("sending back : ", JSON.stringify(user_info))
          response.end(JSON.stringify(user_info))
        })
        break;

      case 'get_user_list':
          Handler.get_user_list(request.body.params, function (user_list){
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(user_list))
          })
          break;

      case 'get_event_list':
          Handler.get_event_list(request.body.params, function (event_list){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(event_list))
          })
          break;

     case 'create_event':
                  Handler.create_event(request.body.params, function (resp){
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(resp))
                  })
                  break;


      case 'change_username':
          Handler.change_username(request.body.params, function (status){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;
      case 'change_password':
          Handler.change_password(request.body.params, function (status){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;
      case 'change_pseudo':
          Handler.change_pseudo(request.body.params, function (status){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;
      case 'change_skin':
          Handler.change_skin(request.body.params, function (status){
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(status))
          })
          break;


      default:
          console.log("this request isn't recognized");
  }
})

app.get('/skins', (request,response) => {

  let file_list = fs.readdirSync(skinFolder)
  file_list.forEach((file, i) => {
    file_list[i]=file.substring(0, file.length-4)
  });

  let file_list_json = {
    "file_list" : file_list
  }
   response.setHeader('Content-type', 'application/json')
   response.end(JSON.stringify(file_list_json))
})

app.get('/events', (request,response) => {

  let file_list = fs.readdirSync(eventFolder)
  file_list.forEach((file, i) => {
    file_list[i]=file.substring(0, file.length-4)
  });

  let file_list_json = {
    "file_list" : file_list
  }
   response.setHeader('Content-type', 'application/json')
   response.end(JSON.stringify(file_list_json))
})

console.log('server is running on port 8080')
console.log('cleaning dynamic tables')
Handler.empty_dynamic_tables()

app.listen(8080)
