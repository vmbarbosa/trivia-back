import { constants } from "../services/utils/constants.js";
import { response } from "../services/utils/response.js";
import { twilioService } from "../services/twilio.service.js";

const { status,message } = constants.response;

export const send_sms = async (req, res) => {
  const response = await twilioService(req);
  res.status(status.OK).json(response.body);
};
