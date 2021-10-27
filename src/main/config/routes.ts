import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  readdirSync(join(__dirname + '/../routes')).forEach(async (file) => {
    if(!file.match(/.test./) && !file.match(/.map/)) {
      (await import(`${__dirname}/../routes/${file}`)).default(router)
    }
  })
  
}