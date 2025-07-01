import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository()
    sut = new SearchGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

it('should be able to search for gyms', async () => {
    await gymsRepository.create({
        title: 'node-gym',
        description: null,
        phone: null,
        latitude: -29.701568,
        longitude: -51.209682
    
    })

    await gymsRepository.create({
        title: 'java-gym',
        description: null,
        phone: null,
        latitude: -29.701568,
        longitude: -51.209682
    })

    const { gyms } = await sut.execute({
        query: 'java',
        page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'java-gym'})])
})

it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++){
        await gymsRepository.create({
            title: `java-gym ${i}`,
            description: null,
            phone: null,
            latitude: -29.701568,
            longitude: -51.209682
        })
    }

    const { gyms } = await sut.execute({
        query: 'java',
        page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
        expect.objectContaining({ title: 'java-gym 21'}),
        expect.objectContaining({ title: 'java-gym 22'}),
    ])
})


})
