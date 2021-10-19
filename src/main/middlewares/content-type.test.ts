import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('should return default content type as json', async () => {
    app.get('/test_content_type', (request, response) => {
      response.send('')
    })
  
    const response = await request(app)
      .get('/test_content_type')

    expect(response.type).toMatch(/json$/i)
  })

  it('should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (request, response) => {
      response.type('xml')
      response.send('')
    })
  
    const response = await request(app)
      .get('/test_content_type_xml')

    expect(response.type).toMatch(/xml$/i)
  })
})