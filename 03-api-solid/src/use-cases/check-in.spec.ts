import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-ins Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'pwr',
      description: '',
      phone: '',
      latitude: new Decimal(-29.701568),
      longitude: new Decimal(-51.209682),
    })

    vi.useFakeTimers()
  })

    afterEach(() => {
        vi.useRealTimers()
     })


    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -29.701568, 
            userLongitude: -51.209682, 
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })


    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -29.701568, 
            userLongitude: -51.209682, 
        })

        await expect(() =>
            sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -29.701568, 
            userLongitude: -51.209682, 
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -29.701568, 
            userLongitude: -51.209682, 
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -29.701568, 
            userLongitude: -51.209682, 
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })



    it('should not be able to check in on distant gym', async () => {
      await gymsRepository.create({
        id: 'gym-02',
        title: 'pwr',
        description: '',
        phone: '',
        latitude: new Decimal(-29.701568),
        longitude: new Decimal(-51.209682),
      })
  
      await expect(() =>
        sut.execute({
          gymId: 'gym-02',
          userId: 'user-01',
          userLatitude: -30.000000,
          userLongitude: -52.000000,
        })
      ).rejects.toBeInstanceOf(MaxDistanceError)
    })

})
