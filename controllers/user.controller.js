import { constants } from "../services/utils/constants.js"
import { update as update_user_service, delete_user as delete_user_service} from "../services/user.service.js"

const { status } = constants.response

const update = async (req, res) => {
    const user_db = await update_user_service(req.params.id, req.body)
    res.status(status.OK).json(user_db)
}

const delete_user = async (req, res) => {
    const resp = await delete_user_service(req.params.id)
    res.status(status.OK).json(resp)
}
export {
    update,
    delete_user
} 
