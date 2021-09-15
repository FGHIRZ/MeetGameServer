let connection = require('../config/db')
const json_maker = require("../json_maker");

class Handler {

    static empty_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
            })
    }

    static login (request, cb) {

        let params = request.body.params
        let name = params.name
        let skin = ''
        let user_id = ''
        let sql = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"

        connection.query(sql, (err, result_select) => {
            if (err) throw  err
            console.log(result_select)
            if (result_select.length === 0)
            {
              let sql = "INSERT INTO STATIC_USER_TABLE (name, skin, password) VALUES ('" + name + "', 'skin1', '1234')"
              connection.query(sql, (err, result) => {
                  if (err) throw  err
                  console.log(result.insertId);
                  skin='skin1'
                  user_id=result.insertId
                  let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES (' " + user_id + "', '"+ new Date() + "', '" + skin + "')"
                  connection.query(sql,(err, result) => {
                      if (err) throw  err
                  })
                  let response = json_maker.login_cb("ok",user_id, skin)
                  cb(response)
              })
            }
            else{
               skin = result_select[0].skin
               user_id = result_select[0].user_id
               let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES (' " + user_id + "', '"+ new Date() + "', '" + skin + "')"
               connection.query(sql,(err, result) => {
                   if (err) throw  err
               })
               let response = json_maker.login_cb("ok",user_id, skin)
               cb(response)
            }

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
            let response = json_maker.update(result)
            cb (response)
        })

    }

    static create_account(request, cb){

        let params = request.body.params
        let name = params.name
        let skin = 'skin1'
        let password = params.password
        //check if this name is already in the static user table
        let sql = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        connection.query(sql, (err, result_select) => {
            if (err) throw  err

            if (result_select.length == 0)
            {
                //if no
                this.insert_account(name, skin , password)
                let response = json_maker.error("ok" ,"")
                cb(response)
            }else{
                //if yes
                let response = json_maker.error("error", 1 )
                cb(response)
            }
        })
    }

    static insert_account(name, skin, password){

        let sql = "INSERT INTO STATIC_USER_TABLE (name, skin, password) VALUES ('" + name + "','" + skin + "','" + password + "')"

        connection.query(sql, (err) => {
            if (err) throw  err
            console.log("account ", name , "added to the db")
        })
    }

}

module.exports = Handler
