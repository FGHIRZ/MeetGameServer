let connection = require('../config/db')

class Handler {

    static clean_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
            })
    }

    static login (request, cb) {

        let params = request.body.params
        let name = params.name
        let skin = ''
        let user_id = ''
        connection.query('SELECT skin, user_id FROM STATIC_USER_TABLE WHERE name = ? ', [ name ], (err, result) => {
            if (err) throw  err
            if (result.length == 0)
            {
              console.log("params", name)
              connection.query('INSERT INTO STATIC_USER_TABLE SET name = ? skin = ? password = ?', [name, "skin1", "1234"],(err, result) => {
                if (err) throw  err
                console.log("test", result)
              })
            }
            else{
               skin = result[0].skin
               user_id = result[0]
            }

            connection.query('INSERT INTO DYNAMIC_USER_TABLE SET user_id = ?, TimeStampRefresh = ? skin = ? ON DUPLICATE KEY UPDATE TimeStampRefresh = ?, skin = ?', [ user_id, new Date(),skin,  new Date(), skin ],(err, result) => {
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

        connection.query('UPDATE DYNAMIC_USER_TABLE SET TimeStampRefresh = ?, lon = ?, lat = ? WHERE user_id = ?', [new Date(), lon, lat, user_id], (err, result) => {
            if (err) throw  err
        })

        connection.query('SELECT * FROM DYNAMIC_USER_TABLE WHERE user_id <> ?', [user_id], (err, result) => {
            if (err) throw err
            let response = this.converter(result)
            cb (response)
        })

    }


    static converter (result){

        let user_list  = JSON.parse(JSON.stringify(result));
        let output = {
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
