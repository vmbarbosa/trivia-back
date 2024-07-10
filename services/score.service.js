import { response } from "./utils/response.js"
import score from "../models/score.js";
import { constants } from "../services/utils/constants.js"

const { status, message} = constants.response

const resetscore = async user_request => {
    const { user_id, id } = user_request;
    let isscore;
    const estructure_response =[];

    try {
        
        if(user_id && id){
            estructure_response.push(400);
            estructure_response.push(response(false, 'Only one id is required'))
            return estructure_response;
        }
        else if (user_id) {
          isscore = await score.findOne({ user_id });
        } else if (id) {
          isscore = await score.findById(id);
        } else {
          estructure_response.push(400);
          estructure_response.push(response(false, 'Neither user_id nor id was provided'))
          return estructure_response
        }
        if (!isscore) {
          estructure_response.push(status.not_found);
          estructure_response.push(response(false, 'Score not found'))
          return estructure_response;
        }
    
        isscore.score = 0;
        isscore.id_correct_answers = [];
        isscore.id_wrong_answers = [];
    
        await isscore.save();
        
        estructure_response.push(status.OK);
        estructure_response.push(response(false, 'Score reset successfully',isscore))
        return estructure_response;
        
      } catch (err) {
        console.error(err.message);
        estructure_response.push(status.not_found);
        estructure_response.push(response(false, 'Generic business error'))
        return estructure_response
      }
}
export { resetscore }