import { response } from "./utils/response.js"
import { constants } from "./utils/constants.js"
import User from "../models/user.js"
import bcrypt from 'bcrypt'
import { user_update_regex } from "./validations/user.validation.js"

const update = async (id, user_info) => {

    // expresión regular para validar si es hexadecimal y 24 caracteres de longitud (Estructura ID en MongoDB)
    const hexRegex = /^[0-9a-fA-F]{24}$/;
    if (!hexRegex.test(id)) return response(false, "User_id Invalid")

    if (Object.keys(user_info).length === 0) return response(false, 'At least one property required')

    const { error } = user_update_regex.validate(user_info)
    if (error) return response(false, error.details[0].message)

    const userdb = await User.findOne({ _id: id })
    if (!userdb) return response(false, "User doesn't exist")

    const { name, nickname, cel, password, confirm_password, email } = user_info

    if (name) userdb.name = name

    if (nickname) {
        const user_nickname = await User.findOne({ nickname })
        if (user_nickname) return response(false, 'Nickname already exists')
        userdb.nickname = nickname
    }
    if (cel) {
        const user_cel = await User.findOne({ cel })
        if (user_cel) return response(false, 'Celular already exists')
        userdb.cel = cel
    }
    if (email) {
        const user_email = await User.findOne({ email })
        if (user_email) return response(false, 'Email already exists')
        userdb.email = email
    }

    if (password && !confirm_password) return response(false, 'Confirm Password required')
    if (password && confirm_password) {
        const salt = await bcrypt.genSalt(constants.bcrypt.rounds)
        const hash = await bcrypt.hash(password, salt)
        userdb.password = hash
    }



    const user_saved = await userdb.save()
    return response(true, 'Update Success', user_saved)
}



export {
    update
} 