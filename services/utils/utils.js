const format_question_response  = inbound_question => {

  const { _id, difficulty, question, wrong_answer, correct_answer } = inbound_question[0]

  const options = [...wrong_answer, correct_answer].sort(() => Math.random() - 0.5)

  const question_response = {
      _id,
      difficulty,
      question,
      options
  }
  
  return question_response
}

export {
  format_question_response
}