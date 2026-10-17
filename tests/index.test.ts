import { expect, test } from 'bun:test'

import { handleRequest } from '#src/index'

test('responds with a greeting', async () => {
  const response = handleRequest()

  expect(await response.text()).toBe('Hello World!')
})
