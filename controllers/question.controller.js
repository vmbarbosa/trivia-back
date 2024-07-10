import { constants } from "../services/utils/constants.js";
import { createAll as createAllService } from "../services/question.service.js";

const { status } = constants.response;

const createAll = async (req, res) => {
  const questionDB = await createAllService(req.body);
  res.status(status.OK).json(questionDB);
};

export { createAll };
