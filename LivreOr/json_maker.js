
class json_maker{

    static error(status , error)
    {
        let output = {
            "status" : status,
            "params" : error
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

    static login(status, user_id, skin)
    {
        let params = {
            "user_id" : user_id,
            "skin" : skin
        }
        let output = {
            "status" : status,
            "params" : params
        }
        return output
    }

}

module.exports = json_maker