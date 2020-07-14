//jshint esversion:6
require('dotenv').config();
var mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/stopwatchDB',

	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		autoIndex: true,
	},
	err => {
		if (!err) {
			console.log('Connection to DB succesfull');
		} else {
			console.log(err);
		}
	}
);

const taskSchema = new mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
	},
	taskTitle: {
		type: String,
		required: true,
	},
	taskCategory: {
		type: String,
		required: true,
	},
	clientName: String,
	duration: {
		seconds: {
			type: Number,
			required: true,
		},
		minutes: {
			type: Number,
			required: true,
		},
		hours: {
			type: Number,
			required: true,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Task = mongoose.model('Task', taskSchema);

const userSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true,
		unique: true,
	},
	lname: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	userCategories: [String],
	userClients: [String],
});

const User = mongoose.model('User', userSchema);

module.exports = {
	Task,
	User,
};
