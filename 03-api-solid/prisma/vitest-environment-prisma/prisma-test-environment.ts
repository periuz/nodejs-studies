import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { Environment } from 'vitest/environments'
import { execSync } from 'node:child_process'
import { prisma } from '@/lib/prisma'

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL){
        throw new Error('Provide a DATABASE_URL env variable!')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        //Create tests

        const schema = randomUUID()
        const databaseUrl = generateDatabaseUrl(schema)

        console.log(databaseUrl)

        process.env.DATABASE_URL = databaseUrl

        execSync('npx prisma migrate deploy')

        return {
            async teardown() {
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
                )

                await prisma.$disconnect()
            },
         }
    },
}
