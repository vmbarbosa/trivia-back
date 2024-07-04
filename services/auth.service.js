import { response } from "./utils/response.js"
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { login_regex, user_regex } from "./validations/auth.validation.js"
import jwt from "jsonwebtoken"


const register = async user_request => {

    const { error } = user_regex.validate(user_request)
    if (error) return response(false, error.details[0].message)
        
    const is_nickname = await User.findOne({ nickname: user_request.nickname})
    if (is_nickname) return response(false, 'nickname already exist')

    const is_cel = await User.findOne({ cel: user_request.cel})
    if (is_cel) return response(false, 'celular already exist')

    delete user_request.confirm_password

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(user_request.password, salt)

    user_request = {
        ...user_request,
        password: hash
    }
    
    const user_db = new User(user_request)

    const new_user = await user_db.save()

    return response(true, 'user created', new_user)
}

const login = async (login_request) => {

    const { error } = login_regex.validate(login_request)
    if (error) return response(false, error.details[0].message)

    const user_db = await User.findOne({ nickname: login_request.nickname})
    if (!user_db) return response(false, 'User don\'t exist')
    
    const valid_password = await bcrypt.compare(login_request.password, user_db.password)
    if (!valid_password) return response(false, 'Incorrect password')

    const payload = {
        id: user_db._id,
        name: user_db.name,
        cel: user_db.cel
    }

    const sign_options = { expiresIn: '3600s'}

    const token = jwt.sign(payload, process.env.TOKEN, sign_options)

    return response(true, 'Login success', token)
}

export {
    register,
    login
}