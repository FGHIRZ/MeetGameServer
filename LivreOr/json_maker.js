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


    static user_list (user_list){

        let params = {
          "user_list" : user_list
        }
        let output = {
            "status" : "ok",
            "params" : params
        }

        return output
    }

    static event_list (event_list){

        let params = {
          "event_list" : event_list
        }
        let output = {
            "status" : "ok",
            "params" : params
        }

        return output
    }

    static user_token(user, access_token)
    {
       console.log(access_token)
        let params = {
            "user_id" : user.user_id,
            "access_token" : access_token
        }
        let output = {
            "status" : "ok",
            "params" : params
        }
        return output
    }

    static user(user)
    {
        let params = {
            "user_id" : user.user_id,
            "user_skin" : user.user_skin,
            "user_pseudo" : user.user_pseudo,
        }
        let output = {
            "status" : "ok",
            "params" : params
        }
        return output
    }



}

module.exports = json_maker
