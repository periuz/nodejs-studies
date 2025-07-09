import { expect, test } from 'vitest'
import { AnswerQuestionsUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

const fakeAnswersRepository: AnswersRepository = {
    create: async (answer: Answer) => {
        return
    }
}

test('create an answer', async () => {
    const answerQuestion = new AnswerQuestionsUseCase(fakeAnswersRepository)

    const answer = await answerQuestion.execute({
        instructorId: '1',
        questionId: '1',
        content: 'New Answer'
    })

    expect(answer.content).toEqual('New Answer')
})