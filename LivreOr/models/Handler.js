let connection = require('../config/db')

class Handler {

    static clean_dynamic_tables (request, cb) {

        // connection.query('DELETE FROM DYNAMIC_USER_TABLE', [ ], (err, result) => {
        //     if (err) throw  err
        //     console.log("DYNAMIC_USER_TABLE has been cleared")
        // })

        connection.query('DELETE * FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
            })
    }

    static login (request, cb) {

        // connection.query('DELETE FROM DYNAMIC_USER_TABLE', [ ], (err, result) => {
        //     if (err) throw  err
        //     console.log("DYNAMIC_USER_TABLE has been cleared")
        // })

        let params = request.body.params
        let user_id = params.id
        let skin = ''
        connection.query('SELECT skin FROM STATIC_USER_TABLE WHERE user_id = ? ', [ user_id ], (err, result) => {
            if (err) throw  err

            skin = result[0].skin
            connection.query('INSERT INTO DYNAMIC_USER_TABLE SET user_id = ?, TimeStampRefresh = ?, lon = ?, lat = ?, skin = ? ON DUPLICATE KEY UPDATE TimeStampRefresh = ?, lon = ?, lat = ?, skin = ?', [ user_id, new Date() , 0.0, 0.0, skin,  new Date() , 0.0, 0.0, skin ],(err, result) => {
                if (err) throw  err
                cb()
            })
        })
    }

    static update (request, cb) {

        let params = request.body.params
        let user_id = params.id
        let lon = params.location.lon
        let lat = params.location.lat

        connection.query('UPDATE DYNAMIC_USER_TABLE SET  user_id = ?, TimeStampRefresh = ?, lon = ?, lat = ? ', [user_id, new Date(), lon, lat], (err, result) => {
            if (err) throw  err
        })

        connection.query('SELECT * FROM DYNAMIC_USER_TABLE', (err, result) => {
            if (err) throw err
            let response = this.converter(result)
            cb (response)
        })

    }


    static converter (result){

        user_list  = JSON.parse(JSON.stringify(result));
        output = {
          "status" : "ok",
          "params" : user_list
        }

        console.log(output)
        return output
    }



    static create_account(request, cb){

    }
}

module.exports = Handler
