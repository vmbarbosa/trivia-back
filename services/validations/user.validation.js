import Joi from "joi";

const user_update_regex = Joi.object({
    name: Joi.string().min(4).max(16),
    nickname: Joi.string().min(4).max(16),
    cel: Joi.string().min(10).max(15),
    password: Joi.string().min(6).max(256),
    confirm_password: Joi.ref('password'),
    email: Joi.string().min(6).max(56).email()
})

export {
    user_update_regex
}