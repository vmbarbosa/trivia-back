import twilio from "twilio";
import dotenv from "dotenv";
import { constants } from "./utils/constants.js";
import { response } from "./utils/response.js";
import { isValidPhoneNumber } from "./validations/phone.validation.js";

dotenv.config();

const { ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER } = process.env;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

const { message } = constants.response;

export const twilioService = async (req) => {
  const to = req.body.cel;
  const nickname = req.user;

  if (!isValidPhoneNumber(to)) {
    return response(false, message.invalid_phone);
  }

  const messageBody = `${nickname} te ha invitado a jugar trivia de Marvel, regístrate para clasificarte en el ranking de todos los jugadores. ¡Demuestra que eres el mejor! https://marvelplay.dev`;

  return client.messages.create({
    body: messageBody,
    from: PHONE_NUMBER,
    to,
  });
};
