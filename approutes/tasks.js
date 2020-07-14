//jshint esversion:6
const routes = require('express').Router();
const { Task } = require('../db');

routes
	.get('/', (req, res) => {
		Task.find((err, found) => {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.send(found);
			}
		});
	})

	.post('/:userEmail', (req, res) => {
		const userEmail = req.params.userEmail;
		const clientFilter = '^' + req.body.clientFilter;
		const categoryFilter = '^' + req.body.categoryFilter;
		console.log(clientFilter);

		console.log('userEmail from params ', userEmail);

		Task.find(
			{
				userEmail: userEmail,
				clientName: { $regex: new RegExp(clientFilter, 'i') },
				taskCategory: { $regex: new RegExp(categoryFilter, 'i') },
			},
			(err, foundTasks) => {
				if (err) {
					res.json(err.message);
				} else {
					res.json(foundTasks);
				}
			}
		);
	})

	// create new timer
	.post('/', async (req, res) => {
		console.log('body', req.body);
		const task = new Task({
			userEmail: req.body.userEmail,
			taskTitle: req.body.taskTitle,
			taskCategory: req.body.taskCategory,
			clientName: req.body.clientName,
			duration: req.body.duration,
		});

		task.save(err => {
			if (err) {
				res.status(400).json({
					success: false,
					message: err.message,
				});
			} else {
				res.json({
					task: task,
					status: 'success',
					message: 'created new task: ' + task,
					success: true,
				});
			}
		});
	});

module.exports = routes;
