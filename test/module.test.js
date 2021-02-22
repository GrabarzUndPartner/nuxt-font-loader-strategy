const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('module', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, '../../example'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Normal')
    expect(html).toContain('Light')
    expect(html).toContain('Bold')
    expect(html).toContain('Italic')
    expect(html).toContain('Mono Normal')
    expect(html).toContain('Mono Bold')
  })
})
