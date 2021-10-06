const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


//a class made to make all methodes of making a json message
class token_manager{

  static generateToken()
  {
    token = require('crypto').randomBytes(64).toString('hex')
  }

  static printToken()
  {
    dotenv.config();
    let test = process.env.TOKEN_SECRET;
    console.log(test)
  }

  static generateAccessToken(username) {
    dotenv.config();
    return jwt.sign(username, process.env.TOKEN_SECRET);
  }
}


test = token_manager.generateAccessToken("balo")
console.log(test)
module.exports = token_manager
