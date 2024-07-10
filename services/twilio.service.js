import twilio from "twilio";
import { constants } from "./utils/constants.js";
import { response } from "./utils/response.js";
import { is_valid_phone_number } from "./validations/phone.validation.js";

const { ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER } = process.env;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

const { message } = constants.response;

const send_sms = async req => {
  const to = req.body.cel;
  const nickname = req.user; //hay que obtener el nickname del jwt

  if (!is_valid_phone_number(to)) {
    return response(false, message.invalid_phone);
  }

  const message_body = `${nickname} te ha invitado a jugar trivia de Marvel, regístrate para clasificarte en el ranking de todos los jugadores. ¡Demuestra que eres el mejor! https://marvelplay.dev`;

  const response_twilio = await client.messages.create({
    body: message_body,
    from: PHONE_NUMBER,
    to,
  });

  return response(true, message.send_sms, response_twilio.body)
};

export { send_sms }