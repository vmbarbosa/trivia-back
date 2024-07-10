import { constants } from "../services/utils/constants.js";
import { send_sms as send_sms_service } from "../services/twilio.service.js";

const { status } = constants.response;

const send_sms = async (req, res) => {
  const response_twilio = await send_sms_service(req);
  res.status(status.OK).json(response_twilio);
};

export default send_sms