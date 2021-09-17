let connection = require('../config/db')
const json_maker = require("../json_maker");

class Handler {

    static empty_dynamic_tables () {

        connection.query('DELETE FROM DYNAMIC_USER_TABLE', [], (err, result) => {
            if (err) throw  err
            })
    }

    static async login (params, cb) {
        let name = params.name
        let password = params.password
        try {
              let response = await this.check_login_password(name, password)
              let sql_query = "SELECT user_id, name, skin  FROM STATIC_USER_TABLE WHERE name='" + name +"'"
              let user = await this.query_db(sql_query)[0]
              console.log("test", user)
              this.update_dynamic_user_table(user.user_id, user.skin)
              response = json_maker.login(user)
              cb(response)
        } catch (e) {
            cb(e)
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

    static async check_login_password(name, password){
      return new Promise(async (resolve, reject) => {

        let sql_query = "SELECT name, password FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let users = await this.query_db(sql_query)

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

    static async update (params, cb) {

        let user_id = params.user_id
        let lon = params.location.lon
        let lat = params.location.lat
        let sql = "UPDATE DYNAMIC_USER_TABLE SET TimeStampRefresh = NOW(), lon = " + lon + ", lat = " + lat + " WHERE user_id = " + user_id
        await this.query_db(sql)
        sql = "SELECT * FROM DYNAMIC_USER_TABLE WHERE user_id <> " + user_id
        let user_list = await  this.query_db(sql)
        let response = json_maker.update(user_list)
        cb(response)
    }

    static async create_account(params, cb){

        let name = params.name
        let skin = 'skin1'
        let password = params.password
        //check if this name is already in the static user table
        let sql = "SELECT * FROM STATIC_USER_TABLE WHERE name='" + name +"'"
        let result = await this.query_db(sql)
        if (result.length === 0)
        {
            await this.insert_account(name, skin, password)
            let response = json_maker.generic("ok" ,"account added")
            cb(response)
        }
        else
        {
            let response = json_maker.error(1, "This account already exists!")
            cb(response)
        }
    }

    static async insert_account(name, skin, password){

        let sql = "INSERT INTO STATIC_USER_TABLE (name, skin, password) VALUES ('" + name + "','" + skin + "','" + password + "')"

        connection.query(sql, (err) => {
            if (err) throw  err
            console.log("account ", name , "added to the db")
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
