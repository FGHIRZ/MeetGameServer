let connection = require('../config/db')

class Message {

    constructor() {
    }

    static create (request, cb) {
        if( request.body.request === "update"){
            let params = request.body.params
            let id = params.id
            let location = params.location
            let skin = params.skin
        }
        connection.query('INSERT INTO messages SET  id = ?, created_at = ?, location = ?, skin = ?', [ id, new Date() , location, skin ], (err, result) => {
            if (err) throw  err
            cb(result)
        })

    }
}
module.exports = Message