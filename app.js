//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
	res.send('hi');
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
	});
}
app.listen(PORT, function () {
	console.log(`Server started on port ${PORT}`);
});