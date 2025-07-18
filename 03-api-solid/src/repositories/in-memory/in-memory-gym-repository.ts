import { Gym, Prisma } from "@prisma/client";
import { FindManyNearBy, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { Decimal } from "generated/prisma/runtime/library";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymsRepository {
    public items: Gym [] = []

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(Number(data.latitude)),
            longitude: new Decimal(Number(data.longitude)),
            created_at: new Date()
        }
        this.items.push(gym)
        return gym
    }

    async findByID(id: string){
        const gym = this.items.find(item => item.id === id)

        if (!gym) {
            return null
        }

        return gym
    }

    async findManyNearBy(params: FindManyNearBy) {
        return this.items.filter(item => {
            const distance = getDistanceBetweenCoordinates (
                {latitude: params.latitude, longitude: params.longitude},
                {latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()}
        )

        return distance < 10
        })
    }

    async searchMany(query: string, page: number){
        return this.items.filter(item => item.title.includes(query))
            .slice((page -1) * 20, page * 20)
    }
}