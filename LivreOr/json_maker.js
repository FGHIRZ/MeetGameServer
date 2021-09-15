//a class made to
class json_maker{

    static error(error, description)
    {
        let params = {
            "code" : error,
            "description" : description
        }

        let output = {
            "status" : "error",
            "params" : params
        }
        return output
    }
    static create_account(status)
    {
        let output = {
            "status" : status
        }
        return output
    }


    static update (result){

        let user_list  = JSON.parse(JSON.stringify(result));
        let output = {
            "status" : "ok",
            "params" : user_list
        }

        console.log(output)
        return output
    }

    static login(user_id, skin)
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

}

module.exports = json_maker
