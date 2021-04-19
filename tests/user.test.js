const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up new user', async () => {
	const response = await request(app)
		.post('/users')
		.send({
			name: 'Pedro',
			email: 'pedro@exmaple.com',
			password: 'MyPass777!',
		})
		.expect(201)

	//Assert that the DB was changed correctly
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	//Assertion about the response
	expect(response.body.user).toMatchObject({
		name: 'Pedro',
		email: 'pedro@exmaple.com',
	})

	//Password not being stored in the db as plain text
	expect(user.password).not.toBe(userOne.password)
})

test('Should log in existing user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200)

	//Validate new token is stored in the db
	const user = await User.findById(response.body.user._id)
	expect(response.body.token).toBe(user.tokens[user.tokens.length - 1].token)
})

test('Should not log in non existing user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: 'Password!!',
		})
		.expect(400)
})

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send()
		.expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
	await request(app).get('/users/me').send().expect(401)
})

test('Should delete account for user', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send()
		.expect(200)

	//Valide the user is not in the db
	const user = await User.findById(userOne._id)
	expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
	await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200)

	const user = await User.findById(userOne._id)
	expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({
			name: 'Mike',
		})
		.expect(200)

	const user = await User.findById(userOne._id)
	expect(user.name).toBe('Mike')
})

test('Should not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({
			location: 'Santiago',
		})
		.expect(400)
})
