import {Gym, Prisma} from "@prisma/client"

export interface FindManyNearBy {
    latitude: number,
    longitude: number
}

export interface GymsRepository {
    create(data: Prisma.GymCreateInput): Promise<Gym>
    findByID(id: string): Promise<Gym | null>
    findManyNearBy(params: FindManyNearBy): Promise <Gym[]>
    searchMany(query: string, page: number): Promise <Gym[]>
}