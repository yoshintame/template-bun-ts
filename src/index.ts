import { serve } from 'bun'

const server = serve({
  port: process.env['PORT'] ?? 3000,
  fetch(): Response {
    return new Response('Hello World!')
  },
})

console.log({ message: `Server running at http://localhost:${server.port}` })
