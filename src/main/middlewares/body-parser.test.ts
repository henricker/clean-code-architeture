import app from '../config/app'
import request from 'supertest'

describe('Body Parser Middleware', () => {
  it('should parse body as json', async () => {
    app.post('/test_body_parser', (request, response) => {
      response.send(request.body)
    })
  
    const response = await request(app)
      .post('/test_body_parser')
      .send({ name: 'henricker' })

    expect(response.body).toEqual({ name: 'henricker' })
  })
})