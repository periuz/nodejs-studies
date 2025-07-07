interface AnswerQuestionsUseCaseRequest {
    instructorId: string
    questionId: string
}

export class AnswerQuestionsUseCase{
    execute ({ instructorId, questionId }: AnswerQuestionsUseCaseRequest) {
        
    }
}

new AnswerQuestionsUseCase().execute({
    questionId: '1',
    instructorId: '2'
})