/** @format */

const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	},
	() => console.log('Mongodb connected successfully'),
)
