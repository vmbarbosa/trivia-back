import jwt from "jsonwebtoken"
import { constants } from "../utils/constants.js"
import { response } from "../utils/response.js"

export const valid_token = (req, res, next) => {

    const { status, message} = constants.response

    const { authorization } = req.headers
    if (!authorization) return res.status(status.not_auth).json(response(false, message.not_auth))

    try {
        jwt.verify(authorization, process.env.TOKEN)

        next()
    } catch (error) {
        res.status(status.not_auth).json(response(false, message.not_jwt))
    }
}

