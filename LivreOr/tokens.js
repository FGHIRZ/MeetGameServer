const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


//a class made to make all methodes of making a json message
class token_manager{

  function init()
  {
      dotenv.config();
  }

  function generateToken()
  {
    token = require('crypto').randomBytes(64).toString('hex')
  }

  function printToken()
  {
    console.log(process.env.TOKEN_SECRET as string)
  }

  function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
}


token_manager.init()
token_manager.printToken()
module.exports = token_manager
