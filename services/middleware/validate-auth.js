import jwt from "jsonwebtoken"
import { constants } from "../utils/constants.js"
import { response } from "../utils/response.js"

export const validate_auth = (req, res, next) => {

    const { status, message} = constants.response

    const { authorization } = req.headers
    if (!authorization){
        req.isAuth = false
        return next()
    }
        
    try {
        jwt.verify(authorization, process.env.TOKEN)
        req.isAuth = true
        next()
    } catch (error) {
        res.status(status.not_auth).json(response(false, message.not_jwt))
    }
}

