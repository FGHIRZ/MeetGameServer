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
        console.log("params", name)
        connection.query('SELECT skin, user_id FROM STATIC_USER_TABLE WHERE name = ?', [ name ], (err, result_select) => {
            if (err) throw  err
            console.log(result_select)
            if (result_select.length == 0)
            {
              var sql = "INSERT INTO STATIC_USER_TABLE (name, skin, password) VALUES (' " + name + "', 'skin1', '1234')"
              connection.query(sql, (err, result) => {
                  if (err) throw  err
                  console.log(result.insertId);
                  skin='skin1'
                  user_id=result.insertId
                  var sql = "INSERT IGNORE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES (' " + user_id + "', '"+ new Date() + "', '" + skin + "')"
                  connection.query(sql,(err, result) => {
                      if (err) throw  err
                  })
                  let response = this.make_login_callback_json(user_id, skin)
                  cb(response)
              })
            }
            else{
               skin = result[0].skin
               user_id = result[0]
               var sql = "INSERT IGNORE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES (' " + user_id + "', '"+ new Date() + "', '" + skin + "')"
               connection.query(sql,(err, result) => {
                   if (err) throw  err
               })
               let response = this.make_login_callback_json(user_id, skin)
               cb(response)
            }

        })
    }

    static make_login_callback_json(user_id, skin)
    {
      let params = {
        "user_id" : user_id,
        "skin" : skin
      }
      let output = {
        "status" : "ok",
        "params" : params
      }
      return output

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
            let response = this.make_update_json(result)
            cb (response)
        })

    }


    static make_update_json (result){

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
