import { serve } from 'bun'

export function handleRequest(): Response {
  return new Response('Hello World!')
}

if (import.meta.main) {
  const server = serve({
    port: process.env['PORT'] ?? 3000,
    fetch: handleRequest,
  })

  console.log({ message: `Server running at ${server.url.href}` })
}
