import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMatricsUseCase } from '@/use-cases/factories/make-get-user-matrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
   const getUserMatricsUseCase = makeGetUserMatricsUseCase()

    const { checkInsCount } = await getUserMatricsUseCase.execute({
        userId: request.user.sub,
    })

    return reply.status(200).send({
        checkInsCount,
    })
}