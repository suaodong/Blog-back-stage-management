import Mock from 'mockjs'

const parseBody = (body?: string) => {
  if (!body) return {}
  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

const getQuery = (url: string) => {
  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return {} as Record<string, string>
  const queryString = url.slice(queryIndex + 1)
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

const ok = <T>(data: T, message = 'ok') => ({ code: 0, data, message })
const fail = (message = 'error') => ({ code: 1, data: null, message })

const createRandomAvatar = () => {
  return `https://q1.qlogo.cn/g?b=qq&s=100&nk=${10000 + Math.floor(Math.random() * 100)}`
}

Mock.setup({ timeout: '200-600' })

Mock.mock(/\/api\/login$/, 'post', (options: any) => {
  const body = parseBody(options.body)
  const username = String(body.username || '').trim()
  const password = String(body.password || '').trim()

  if (!username || !password) return fail('请输入用户名和密码')

  if (password !== '123456') return fail('用户名或密码错误')

  return ok({ token: `mock-token-${username}` })
})

Mock.mock(/\/api\/user\/info(\?.*)?$/, 'get', (options: any) => {
  const query = getQuery(String(options.url || ''))
  const token = String(query.token || '')
  if (!token) return fail('缺少 token')

  const username = token.replace(/^mock-token-/, '') || 'Admin'
  const roles = username === 'admin' ? ['admin'] : ['editor']

  return ok({
    name: username,
    roles,
    avatar: createRandomAvatar()
  })
})

Mock.mock(/\/api\/logout$/, 'post', () => ok(null))

