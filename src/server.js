import Fastify from 'fastify'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import * as path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const PROTO_PATH = path.join(__dirname, "./proto/mailer.proto")

const fastify = Fastify({
  logger: false
})

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)
const Service = grpc.loadPackageDefinition(packageDefinition).MailService

const client = new Service(
  "localhost:50051",
  grpc.credentials.createInsecure()
)

fastify.get('/', async (request, reply) => {
  client.send({ email: 'myemail@gmail.com', message: request.query.message }, (error, replyMicroservice) => {
    if (error) throw error
      reply.send(replyMicroservice.message)
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
