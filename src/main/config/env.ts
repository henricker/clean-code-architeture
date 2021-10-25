export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.port || 5050,
  secret: process.env.JWT_SECRET_KEY || 'taoisud12367klfdu123809-12=1e=qe809qkasjdklasjd'
}