import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
     })


    it('should be able to validate check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym_01',
            user_id: 'user-01'
        })
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
            userId: 'user-01',
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(() => 
        sut.execute({
            checkInId: 'inexistent-check-in-id',
            userId: 'user-01',
        }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate the check-ins after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
        
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym_01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)
        
        await expect(() => sut.execute({
            checkInId: createdCheckIn.id,
            userId: 'user-01'
        })).rejects.toBeInstanceOf(Error)

        

    })
})
