import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('should return an account', async () => {  
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'henricker',
        email: 'henricker@email.com',
        password: 'MyHardPassword12301293012398@@@@1!2371739',
        passwordConfirmation: 'MyHardPassword12301293012398@@@@1!2371739'
      })
      .expect(200)
  
  })
})