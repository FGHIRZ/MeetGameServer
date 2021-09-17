//a class made to make all methodes of making a json message
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

    static generic(status, description)
    {
        let params = {
            "description" : description
        }
        let output = {
            "status" : status,
            "params" : params
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

    static login(user)
    {
        let params = {
            "user_id" : user.user_id,
            "skin" : user.skin
        }
        let output = {
            "status" : "ok",
            "params" : params
        }
        return output
    }


}

module.exports = json_maker
