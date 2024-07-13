import jwt from "jsonwebtoken";
import { constants } from "../utils/constants.js";
import { response } from "../utils/response.js";

export const get_user = async (req, res, next) => {
  const { status, message } = constants.response;
  const { authorization } = req.headers;
    console.log(authorization)
  if (!authorization)
    return res.status(status.not_auth).json(response(false, message.not_auth));

  try {
    const decoded = jwt.verify(authorization, process.env.TOKEN);
    const user = decoded.user;
    console.log(user)
    if (!user)
      return res
        .status(status.not_auth)
        .json(response(false, message.not_auth));
    req.user = user;
    next();
  } catch (error) {
    res.status(status.not_auth).json(response(false, message.not_jwt));
  }
};