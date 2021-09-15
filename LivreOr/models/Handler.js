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
        let response = ''

        connection.query(sql, (err, result_select) => {

            if (err) throw  err
            console.log(result_select)

            if (result_select.length === 0) {

                response = json_maker.error("3", "account does not exist")

            }else{

                response = this.check_login_password(result_select)
                this.update_dynamic_user_table(user_id, skin)
                cb(response)

            }
<<<<<<< HEAD
=======
        })
    }

    static update_dynamic_user_table(user_id, skin){
        let sql = "REPLACE INTO DYNAMIC_USER_TABLE (user_id, TimeStampRefresh, skin) VALUES"+ "('" + user_id + "','" + new Date() + "','" + skin + "')"
        connection.query(sql,(err, result) => {
            if (err) throw  err
>>>>>>> ac9cbf3d736ed4a70ed7217d7f7136fb85820b15
        })
    }

    static check_login_password(result_select){
        let skin = result_select[0].skin
        let user_id = result_select[0].user_id
        let password = result_select[0].password
        let name = result_select[0].name
        let response = ""

        let sql = "SELECT password FROM STATIC_USER_TABLE WHERE name='" + name +"'"

        connection.query(sql, (err, password_select) => {

            if (err) throw  err
            console.log(password_select)

            if (password_select === password) {

                response = json_maker.login("ok",user_id, skin)

            }else{

                response = json_maker.error("2","password and login does not match")

            }

        })

        return response
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

            if (result_select.length === 0)
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
