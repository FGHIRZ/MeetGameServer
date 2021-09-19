let connection = require('../config/db')
const json_maker = require("../json_maker");

class Handler {

    static empty_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
          })
          connection.query('DELETE FROM DYNAMIC_EVENT_TABLE', [], (err, result) => {
              if (err) throw  err
              })
    }

    static async login (params, cb) {
        let name = params.name
        let password = params.password
        try {
              let response = await this.check_login_password(name, password)
              let sql_query = "SELECT user_id, name, skin  FROM STATIC_USER_TABLE WHERE name='" + name +"'"
              let select = await this.db_query(sql_query)
              let user = select[0]
              this.update_dynamic_user_table(user.user_id, user.skin)
              response = json_maker.login(user)
              cb(response)
        } catch (e) {
            cb(e)
        }
    }

    static db_query(sql){
      return new Promise(function(resolve, reject) {
        connection.query(sql, (err, result) => {
          if(err) return reject(err)
          resolve(result)
        })
      })
    }

    static sync_db_query(sql){
        connection.query(sql, (err, result) => {
          if(err) return err
          return result
        })
    }

    static update_dynamic_user_table(user_id, skin){
        let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES"+ "('" + user_id + "', NOW(),'" + skin + "')"
        connection.query(sql,(err, result) => {
            if (err) throw  err
        })
    }

    static async check_login_password(name, password){
      return new Promise(async (resolve, reject) => {

        let sql_query = "SELECT name, password FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let users = await this.db_query(sql_query)

        if(users.length === 0){
            let response =  json_maker.error(1, "this account does not exist")
            reject(response)

        }else{

            let user = users[0]
            if(user.password === password){
                resolve(user)
            }else{
                let response = json_maker.error(2, "the name and the password does not match")
                reject(response)
            }
        }
      })

    }

    static async get_user_list (params, cb) {

        let user_id = params.user_id
        let lon = params.location.lon
        let lat = params.location.lat
        let visible = params.visible
        if(visible)
        {
          let sql = "UPDATE DYNAMIC_USER_TABLE SET TimeStampRefresh = NOW(), lon = " + lon + ", lat = " + lat + " WHERE user_id = " + user_id
          this.sync_db_query(sql)
        }
        let sql = "SELECT * FROM DYNAMIC_USER_TABLE WHERE user_id <> " + user_id
        let user_list = await this.db_query(sql)
        let response = json_maker.user_list(user_list)
        cb(response)
    }

    static async get_event_list (params, cb) {

        let lon = params.location.lon
        let lat = params.location.lat
        let sql = "SELECT * FROM DYNAMIC_EVENT_TABLE"
        let event_list = await this.db_query(sql)
        let response = json_maker.event_list(event_list)
        cb(response)
    }

    static async create_event(params, cb){

            let type = params.type
            let lat = params.lat
            let lon = params.lon
            let sqliquery = "INSERT INTO DYNAMIC_EVENT_TABLE (type, creationdate, lat, lon) VALUES ('" + type + "', NOW() , " + lat + ", " + lon + ")"
            this.sync_db_query(sql_query)
            let response = json_maker.generic("ok" ,"event added")
            cb(response)
    }

    static async create_account(params, cb){

        let name = params.name
        let skin = 'skin1'
        let password = params.password
        //check if this name is already in the static user table
        let sql = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let result = await this.db_query(sql)
        let response=""
        if (result.length === 0)
        {
          try {
            await this.insert_account(name, skin, password)
            let response = json_maker.generic("ok" ,"account added")
            cb(response)
          } catch (e) {
            let response = json_maker.error(1, "This account already exists!")
            cb(response)
          }
        }
    }

    static async insert_account(name, skin, password){

      return new Promise(async (resolve, reject) => {
        let sql = "INSERT INTO STATIC_USER_TABLE (name, skin, password) VALUES ('" + name + "','" + skin + "','" + password + "')"

        connection.query(sql, (err) => {
            if (err) reject(err)
            console.log("account ", name , "added to the db")
            resolve()
        })
      })
    }

    static delete_account(params,cb){
        let user_id = params.user_id
        let response = ""
        let sql = "DELETE FROM STATIC_USER_TABLE (user_id) VALUES ('" + user_id + "')"

        connection.query(sql, (err) => {
            if (err){
                throw  err
                response = json_maker.error("4","an error occured during the removal process")
                cb(response)

            }else{
                 console.log("user id "+ user_id + "has removed from the database ")
                response = json_maker.generic("ok","account deleted")
                cb(response)
            }
        })
    }

    static change_name(params, cb){
        let user_id = params.user_id
        let new_name = params.name

        let sql = "REPLACE INTO STATIC_USER_TABLE (user_id, name) VALUES ('" + user_id +"','"+ new_name + "')"
        let response = ""

        connection.query(sql, (err) => {
            if (err){
                throw  err
                response = json_maker.error("5","an error occured during the name change process")
                cb(response)

            }else{
                console.log("user id "+ user_id + " has changed his name to "+ new_name)
                response = json_maker.generic("ok","name changed")
                cb(response)
            }
        })


    }

    static change_password(params, cb){
        let user_id = params.user_id
        let name = params.name
        let password = params.password
        let new_password = params.new_password

        let response = this.check_login_password(name, password)

        let sql = "REPLACE INTO STATIC_USER_TABLE (user_id, password) VALUES ('" + user_id +"','"+ new_password + "')"

        connection.query(sql, (err) => {
            if (err){
                throw  err
                response = json_maker.error("6","an error occured during the password change process")
                cb(response)

            }else{
                console.log("user id "+ user_id + "has changed his password from to "+ new_password)
                response = json_maker.generic("ok","password changed")
                cb(response)
            }
        })

    }

    static change_pseudo(params, cb){
        let user_id = params.user_id
        let name = params.name
        let pseudo = params.pseudo
        let response = ""

        let sql = "REPLACE INTO STATIC_USER_TABLE (name, pseudo) VALUES ('" + name +"','"+ pseudo + "')"

        connection.query(sql, (err) => {
            if (err){
                throw  err
                response = json_maker.error("7","an error occured during the pseudo change process")
                cb(response)

            }else{
                console.log("user id "+ user_id + "has changed his pseudo from to "+ pseudo)
                response = json_maker.generic("ok","pseudo changed")
                cb(response)
            }
        })

    }



}

module.exports = Handler
