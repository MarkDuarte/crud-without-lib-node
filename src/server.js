import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'


const server = http.createServer( async (request, response) => {
  const { method, url } = request

  await json(request, response)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  try {
    if (route) {
      const routeParams = request.url.match(route.path)

      const { query, ...params } = routeParams.groups

      request.params = params
      request.query = query ? extractQueryParams(query) : {}

      return route.handle(request, response)
    }
  } catch (err) {
    return response.writeHead(404).end()
  }

})

server.listen(3333)

