const request = require('supertest')
const app = require('../src/app')
require('dotenv').config({path: '../src/test.env'})
const User = require('../src/models/user')

const user1 = {
	name: 'user1',
	email: 'test4@gmail.com',
	password: 'test123',
}
beforeEach(async () => {
	await User.deleteMany()
	await new User(user1).save()
})

test('Should sign up a new user', async () => {
	await request(app)
		.post('/users')
		.send({
			name: 'Musk',
			email: 'test3@gmail.com',
			password: 'test123',
		})
		.expect(201)
})

test('Should login existing user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: user1.email,
			password: user1.password,
		})
		.expect(200)
})
test('Should not login non existing user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: user1.email,
			password: 'random',
		})
		.expect(400)
})
