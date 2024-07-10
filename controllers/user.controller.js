import { constants } from "../services/utils/constants.js"
import { update as update_service } from "../services/user.service.js"

const { status } = constants.response

const update = async (req, res) => {
    const user_db = await update_service(req.params.id, req.body)
    res.status(status.OK).json(user_db)
}
const deleteUser = async (req, res) => {
    const userId = req.params.id
    const resp = await deleteUser_service (userId)
    res.status(status.OK).json(resp)
}
export {
    update,
    deleteUser
} 
