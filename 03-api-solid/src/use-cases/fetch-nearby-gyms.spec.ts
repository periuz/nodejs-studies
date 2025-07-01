import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { SearchGymsUseCase } from './search-gyms'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearbt Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'near-gym',
            description: null,
            phone: null,
            latitude: -29.701568,
            longitude: -51.209682
        
        })

        await gymsRepository.create({
            title: 'far-gym',
            description: null,
            phone: null,
            latitude: -27.701568,
            longitude: -49.209682
        })

        const { gyms } = await sut.execute({
            userLatitude: -29.701568, 
            userLongitude: -51.209682,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'near-gym'})])
    })

})
