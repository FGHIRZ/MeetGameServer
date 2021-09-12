let connection = require('../config/db')

class Message {

    static create (content, cb) {
        if( content.request === "update"){
            params = content.params
            id = params.id
            location = params.location
            skin = params.skin
        }
        connection.query('INSERT INTO messages SET  id = ?, created_at = ?, location = ?, skin = ?', [ id, new Date() , location, skin ], (err, result) => {
            if (err) throw  err
            cb(result)
        })

    }
}
module.exports = Message