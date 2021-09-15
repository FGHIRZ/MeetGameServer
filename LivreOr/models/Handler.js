let connection = require('../config/db')
const json_maker = require("../json_maker");

class Handler {

    static empty_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
            })
    }

    static async login (request, cb) {

        let params = request.body.params
        let name = params.name
        let skin = ''
        let user_id = ''
        let sql_query = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let response = ''
        let res = ''
        try{
          users = await this.query_db(sql_query)
        }
        catch(error)
        {
          console.log(error)
        }
        console.log(users)
    }

    static async querry_db(sql){
      return new Promise(function(resolve, reject) {
        try{
        connection.query(sql, (err, result) => {
          if(err) return reject(err)
          return resolve(result)
        })
      }
      catch(error)
      {
        reject(error)
      }
      })
    }

    static update_dynamic_user_table(user_id, skin){
        let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES"+ "('" + user_id + "', NOW(),'" + skin + "')"
        connection.query(sql,(err, result) => {
            if (err) throw  err
        })
    }

    static async check_login_password(user){
        console.log(user)
        let skin = user.skin
        let user_id = user.user_id
            if (result.length === 0) {
        let password = user.password
        let name = user.name
        let response = ""

        let sql = "SELECT password FROM STATIC_USER_TABLE WHERE name='" + name +"'"

        await connection.query(sql, (err, password_select) => async function() {
            if (err) throw  err
            if (password_select === password) {

                response = json_maker.login("ok",user_id, skin)

            }else{
                response = json_maker.error("2","password and login does not match")
            }
            return response
        })
    }
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
        connection.query(sql, (err, result) => {
            if (err) throw  err

            if (result.length === 0)
            {
                //if no
                this.insert_account(name, skin , password)
                let response = json_maker.create_account("ok" )
                cb(response)
            }else{
                //if yes
                let response = json_maker.error(1, "This account already exists!")
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
