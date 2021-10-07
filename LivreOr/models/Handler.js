let connection = require('../config/db')
const json_maker = require("../json_maker");
const token_manager = require("../tokens");

class Handler {

    static empty_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
          })
          connection.query('DELETE FROM DYNAMIC_EVENT_TABLE', [], (err, result) => {
              if (err) throw  err
              })
    }

    static async create_account(params, cb){

        let username = params.username
        let user_skin = 'default_skin'
        let password = params.password
        //check if this username is already in the static user table
        let sql = "SELECT * FROM STATIC_USER_TABLE WHERE username='" + username +"'"
        let result = await this.db_query(sql)
        let response=""
        if (result.length === 0){
            try {
                await this.insert_account(username, user_skin, password)
                let response = json_maker.generic("ok" ,"account added")
                cb(response)
            } catch (e) {
                let response = json_maker.error(8, "A problem occured during the insert of account!")
                cb(response)
            }
        }else{
            let response = json_maker.error(1, "This account already exists!")
            cb(response)
        }
    }

    static async delete_account(params,cb){
        let user_id = params.user_id
        let username = params.username
        let password = params.password

        try {
            let response = await this.check_login_password(username, password)

            let sql = "DELETE FROM STATIC_USER_TABLE " +
                "WHERE user_id = ?"
            let data = [user_id]

            connection.query(sql,data, (err) => {
                if (err){
                    throw  err
                    response = json_maker.error("4","an error occured during the account removal process")
                    cb(response)

                }else{
                    console.log("user id "+ user_id + "has removed from the database ")
                    response = json_maker.generic("ok","account deleted")
                    cb(response)
                }
            })
        }catch(error){
            let response = json_maker.error("4","an error occured during the account removal process : " + error )
            cb(response)
        }
    }

    static get_access_token(params, cb){
      let user_id = params.user_id
      let access_token = token_manager.generateAccessToken(user_id)
      let response = json_maker.access_token(access_token)
      cb(response)
    }

    static async login (params, cb) {
        let username = params.username
        let password = params.password
        try {
            let response = await this.check_login_password(username, password)
            let sql_query = "SELECT user_id FROM STATIC_USER_TABLE WHERE username='" + username +"'"
            let select = await this.db_query(sql_query)
            let user = select[0]
            let refresh_token = token_manager.generateRefreshToken(params.username)
            response = json_maker.refresh_token(user, refresh_token)
            cb(response)
        } catch (e) {
            cb(e)
        }
    }

    static async get_my_info(params, cb)
    {

      let user_id = params.user_id
      try {
          let sql_query = "SELECT user_id, user_skin, user_pseudo  FROM STATIC_USER_TABLE WHERE user_id='" + user_id +"'"
          let select = await this.db_query(sql_query)
          let user = select[0]
          this.update_dynamic_user_table(user.user_id, user.user_skin, user.user_pseudo)
          let response = json_maker.user(user);
          cb(response)
      } catch (e) {
          cb(e)
      }
    }

    static async check_login_password(username, password){
        return new Promise(async (resolve, reject) => {

            let sql_query = "SELECT username, password FROM STATIC_USER_TABLE WHERE username='" + username +"'"
            let users = await this.db_query(sql_query)

            if(users.length === 0){
                let response =  json_maker.error(1, "this account does not exist")
                reject(response)

            }else{

                let user = users[0]
                if(user.password === password){
                    console.log("login and password are matching")
                    resolve(user)
                }else{
                    let response = json_maker.error(2, "the username and the password does not match")
                    reject(response)
                }
            }
        })
    }

    static async get_user_list (params, cb) {

        let user_id = params.user_id
        let lon = params.user_location.lon
        let lat = params.user_location.lat
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
        // TODO pour plus tard , filtrer le contenu a requeter

        let sql = "SELECT * FROM DYNAMIC_EVENT_TABLE"
        let event_list = await this.db_query(sql)
        let response = json_maker.event_list(event_list)
        cb(response)
    }

    static async create_event(params, cb){

            let event_type = params.event_type
            let lat = params.event_location.lat
            let lon = params.event_location.lon
            let sql_query = "INSERT INTO DYNAMIC_EVENT_TABLE (event_type, creationdate, lat, lon) VALUES ('" + event_type + "', NOW() , " + lat + ", " + lon + ")"
            this.sync_db_query(sql_query)
            let response = json_maker.generic("ok" ,"event added")
            cb(response)
    }


    static change_username(params, cb){
        let user_id = params.user_id
        let new_username = params.new_username
        // let password = params.password

        let sql = "UPDATE STATIC_USER_TABLE SET username = " + "'" + new_username + "'" + " WHERE user_id = " + "'" + user_id + "'"

        let response = ""

        connection.query(sql, (err) => {
            if (err){
                throw  err
                response = json_maker.error("5","an error occured during the username change process")
                cb(response)

            }else{
                console.log("user id "+ user_id + " has changed his username to "+ new_username)
                response = json_maker.generic("ok","username changed")
                cb(response)
            }
        })

    }

    static async change_password(params, cb){

        let user_id = params.user_id
        let username = params.username
        let password = params.password
        let new_password = params.new_password

        try {
            let response = await this.check_login_password(username, password)

            let sql = "UPDATE STATIC_USER_TABLE " +
                "SET password = ?" +
                "WHERE user_id = ?"
            let data = [new_password, user_id]

            connection.query(sql,data, (err) => {
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
        }catch(error){
                cb(error)
        }

    }

    static async change_pseudo(params, cb){

        let user_id = params.user_id
        let user_pseudo = params.user_pseudo
        let response = ""

        try{

            let sql = "UPDATE STATIC_USER_TABLE SET user_pseudo = " + "'" + user_pseudo + "'" + " WHERE user_id = " + "'" + user_id + "'"

            let result = await this.db_query(sql)

            sql = "UPDATE DYNAMIC_USER_TABLE SET user_pseudo = " + "'" + user_pseudo + "'" + " WHERE user_id = " + "'" + user_id + "'"
            result = await this.db_query(sql)
            console.log("user id "+ user_id + " has changed his pseudo to "+ user_pseudo)
            response = json_maker.generic("ok","pseudo changed")
            cb(response)

        }catch(e){
            let response = json_maker.error("13","an error occured during the pseudo change process : " + e)
            cb(response)
        }
    }

    static async change_skin(params, cb){

        let user_id = params.user_id
        let user_skin = params.user_skin
        let response = ""

        try{

            let sql = "UPDATE STATIC_USER_TABLE SET user_skin = " + "'" + user_skin + "'" + " WHERE user_id = " + "'" + user_id + "'"

            let result = await this.db_query(sql)


            sql = "UPDATE DYNAMIC_USER_TABLE SET user_skin = " + "'" + user_skin + "'" + " WHERE user_id = " + "'" + user_id + "'"
            result = await this.db_query(sql)
            console.log("user id "+ user_id + " has changed his skin  to "+ user_skin)
            response = json_maker.generic("ok","skin changed")
            cb(response)

        }catch(e){
            let response = json_maker.error("12","an error occured during the skin change process : " + e)
            cb(response)
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

    static update_dynamic_user_table(user_id, user_skin, user_pseudo, token){
        let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, user_skin, user_pseudo, Token) VALUES"+ "('" + user_id + "', NOW(),'" + user_skin + "', '"+ user_pseudo + "', '" + token + "')"
        connection.query(sql,(err, result) => {
            if (err) throw  err
        })
    }

    static async insert_account(username, user_skin, password){

        return new Promise(async (resolve, reject) => {
            let sql = "INSERT INTO STATIC_USER_TABLE (username, user_skin, password, user_pseudo, created_at) VALUES ('" + username + "','" + user_skin + "','" + password + "','" + username + "', NOW() )"

            connection.query(sql, (err) => {
                if (err) reject(err)
                resolve()
            })
        })
    }

}

module.exports = Handler
