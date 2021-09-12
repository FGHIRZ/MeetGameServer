let connection = require('../config/db')

class Message {

    constructor() {
    }

    static create (request, cb) {
        if( request.body.request === "update"){
            let params = request.body.params
            let id = params.id
            let lon = params.location.lon
            let lat = params.location.lat
            let skin = params.skin

            connection.query('INSERT INTO messages SET  id = ?, created_at = ?, lon = ?, lat = ?, skin = ?', [ id, new Date() , lon, lat, skin ], (err, result) => {
                if (err) throw  err
                cb(result)
            })
        }

    }
}
module.exports = Message