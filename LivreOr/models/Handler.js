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
        let password = params.password

        let sql_query = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let users = await this.query_db(sql_query)
        console.log(users)

        if(users.length===0)
        {
          let response = json_maker.error(1, "Pas d'utilisateur avec ce nom")
          cb(response)
        }
        else {
          let user = users[0]
          console.log(user.password, password)
          if(this.check_login_password(user.password password))
          {
            console.log("sending ok")
            let response = json_maker.login(user.used_id, user.skin)
            cb(response)
          }
          else {
            console.log("sending error")
            let response = json_maker.error(2, "mauvais mot de passe")
            cb(response)
          }
        }
    }

    static query_db(sql){
      return new Promise(function(resolve, reject) {
        connection.query(sql, (err, result) => {
          if(err) return reject(err)
          resolve(result)
        })
      })
    }

    static update_dynamic_user_table(user_id, skin){
        let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES"+ "('" + user_id + "', NOW(),'" + skin + "')"
        connection.query(sql,(err, result) => {
            if (err) throw  err
        })
    }

    static check_login_password(user_password, entered_password){
        if(user_password === entered_password)
        {
          return true
        }
        return false
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

    static create_account(request){

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
