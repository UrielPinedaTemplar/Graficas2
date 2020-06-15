def tf_quiz(question, correct_ans):
    user_respuesta = input('T/F ' + question + ': ')
    if user_respuesta.lower() == correct_ans.lower():
        true_respuesta = 'correct'
    else:
        true_respuesta = 'incorrect'
    
    return true_respuesta

quiz_eval = tf_quiz('octopuses have green blood', 'f')


print('your answer is ', quiz_eval)


    

        