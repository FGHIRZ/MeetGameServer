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
    let token = process.env.TOKEN_SECRET;
  }

  static generateAccessToken(userId) {
    dotenv.config();
    return jwt.sign({userId : userId}, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: 3600
    });
  }

  static generateRefreshToken(username) {
    dotenv.config();
    return jwt.sign({username : username}, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: 86400
    });
  }

  static authenticateToken(req, res, next) {
  dotenv.config();
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)
      let token_secret = process.env.TOKEN_SECRET
      jwt.verify(token, token_secret, (err, verifiedJwt) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      next()
  })
  }
}

module.exports = token_manager
