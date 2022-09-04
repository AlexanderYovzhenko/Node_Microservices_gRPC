import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import * as path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

function main() {
  const RPC_PATH = path.join(__dirname, "../proto/mailer.proto")
  const packageDefinition = protoLoader.loadSync(RPC_PATH)
  const notesProto = grpc.loadPackageDefinition(packageDefinition)
  const server = new grpc.Server()

  server.addService(notesProto.MailService.service, {
    send(payload, send) {
      send(null, {
        status: true,
        message: `Hello! Your message: ${payload.request.message}`, 
        email: payload.request.email
      })
    }
  })
  
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start()
  })
}

main()
