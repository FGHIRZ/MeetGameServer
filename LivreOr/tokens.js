const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


//a class made to make all methodes of making a json message
class token_manager{

  static init()
  {
      dotenv.config();
  }

  static generateToken()
  {
    token = require('crypto').randomBytes(64).toString('hex')
  }

  static printToken()
  {
    let test = process.env.TOKEN_SECRET;
    console.log(test)
  }
}


token_manager.init()
token_manager.printToken()
module.exports = token_manager
