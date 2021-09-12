let connection = require('../config/db')

class Handler {

    static create (request, cb) {
        if( request.body.request === "update"){
            let params = request.body.params
            let user_id = params.id
            let lon = params.location.lon
            let lat = params.location.lat

            connection.query('UPDATE DYNAMIC_USER_TABLE SET  id = ?, created_at = ?, lon = ?, lat = ?', [ user_id, new Date() , lon, lat ], (err, result) => {
                if (err) throw  err
                cb(result)
            })
        }
        if( request.body.request === "login"){
            connection.query('DELETE FROM DYNAMIC_USER_TABLE', [ ], (err, result) => {
                if (err) throw  err
                console.log("DYNAMIC_USER_TABLE has been cleared")
            })


            let params = request.body.params
            let user_id = params.id
            let skin = ''
            connection.query('SELECT skin FROM STATIC_USER_TABLE WHERE user_id = ? ', [ user_id ], (err, result) => {
                if (err) throw  err

                skin = result[0].skin
                console.log(result, result[0], result[0].skin)
                connection.query('INSERT INTO DYNAMIC_USER_TABLE SET  user_id = ?, TimeStampRefresh = ?, lon = ?, lat = ?, skin = ?', [ user_id, new Date() , 0.0, 0.0, skin ], (err, result) => {
                    if (err) throw  err
                    cb(result)
                })
            })

        }

    }
}
module.exports = Handler