import fs from 'fs/promises'
import * as glob from 'glob'
import mime from 'mime-types'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async (server, { hdbCore, logger }) => {
  // Simple passthrough to the underlying HarperDB API
  server.route({
    url: '/static/**',
    method: 'GET',
    handler: async (request, reply) => {
      const file = request.url.replace('/todoist/static/', '')
      // Ensure this is a file within the static directory
      let files = await glob.glob(resolve(__dirname, '../static/**'), { nodir: true })
      files = files.map(file => file.replace(resolve(__dirname, '../static') + '/', ''))

      if (!files.includes(file)) {
        return { success: false, message: 'This is not a valid file.' }
      }

      const fileContents = await fs.readFile(
        resolve(__dirname, `../static/${file}`),
        'utf-8'
      )
      reply
        .code(200)
        .header('Content-Type', `${mime.lookup(file)}; charset=utf-8`)
        .send(fileContents)
    }
  })
}
