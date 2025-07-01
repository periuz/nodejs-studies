import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMatricsUseCase } from './get-user-matrics'

let checkInsRepository: InMemoryCheckInRepository
let sut: GetUserMatricsUseCase

describe('Get User Matrics Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new GetUserMatricsUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    it('should be able to get check-ins from user metrics', async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01', 
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01', 
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })

        expect(checkInsCount).toEqual(2)
    })

})
