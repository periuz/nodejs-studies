import {expect, test, describe, it, beforeEach} from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'


let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should able to create gym', async () => {
        const { gym } = await sut.execute ({
            title: 'pwr',
            description: null,
            phone: null,
            latitude: -29.701568,
            longitude: -51.209682
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})