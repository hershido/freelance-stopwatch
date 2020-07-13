import React, { useState, useEffect, useRef } from 'react';

import { Redirect } from 'react-router-dom';
import TaskTable from './TaskTable';

import Input from './Input';
import Clock from './Clock';
import BtnsContainer from './BtnsContainer';

const States = {
	PENDING: 'PENDING',
	STARTED: 'STARTED',
	PAUSED: 'PAUSED',
};

const btnText = {
	PENDING: 'Start',
	STARTED: 'Pause',
	PAUSED: 'Resume',
};

function Stopwatch() {
	// set initial state for stopwatch
	const user = JSON.parse(localStorage.getItem('loggedinUser'));
	const [userData, setUserData] = useState(null);
	const [clockState, setClockState] = useState(States.PENDING);
	const tableRef = useRef(null);
	// console.log("user", user);

	const [timer, setTimer] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	// set the intervalid to null
	const [intervalId, setIntervalId] = useState(null);

	const [startButton, setStartButton] = useState('Start');
	// set input fields to empty
	const [taskInput, setTaskInput] = useState({
		task: '',
		category: '',
		client: '',
	});

	const [filter, setFilter] = useState({
		category: '',
		client: '',
	});

	const [tasksArray, setTasksArray] = useState([]);
	const [totalDuration, setTotalDuration] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const [message, setMessage] = useState({
		showMessage: false,
		messageSuccess: false,
	});

	// Sets the states based on user inputs
	function handleInput(event) {
		const value = event.target.value;
		const fieldName = event.target.name;
		setTaskInput(prevState => {
			return {
				...prevState,
				[fieldName]: value,
			};
		});
	}
	function handleInput2(name, value) {
		console.log('handleInput2', name, value);
		setTaskInput(prevState => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

	function handleFilter(event) {
		const value = event.target.value;
		const fieldName = event.target.name;
		setFilter(prevState => {
			return {
				...prevState,
				[fieldName]: value,
			};
		});
	}

	function watchToggle() {
		messageClear();
		if (!intervalId) {
			// start timer
			setClockState(States.STARTED);
			setStartButton('Pause');
			const id = setInterval(() => {
				setTimer(prevState => {
					let minutes = prevState.minutes;
					let seconds = prevState.seconds;
					let hours = prevState.hours;

					if (seconds === 59) {
						seconds = 0;
						minutes++;
					} else {
						seconds++;
					}

					if (minutes === 59) {
						minutes = 0;
						hours++;
					}
					return { seconds, minutes, hours };
				});
			}, 1);

			//  save interval id
			setIntervalId(id);
		} else {
			// pause timer
			clearInterval(intervalId);
			setStartButton('Resume');
			setClockState(States.PAUSED);
			//   remove internal id from stae
			setIntervalId(null);
		}
	}

	function watchDone() {
		clearInterval(intervalId);
		setIntervalId(null);
		setStartButton('Start');
		setClockState(States.PENDING);
		// send request to server
		fetch('http://localhost:5000/tasks/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // body type
			},
			body: JSON.stringify({
				userEmail: user,
				taskTitle: taskInput.task,
				taskCategory: taskInput.category,
				clientName: taskInput.client,
				// duration: timer.seconds * 1000 + timer.minutes * 60000 + timer.hours * 3600000,
				duration: {
					seconds: timer.seconds,
					minutes: timer.minutes,
					hours: timer.hours,
				},
			}),
		})
			.then(function (response) {
				// run after get response from server
				console.log('res', response);
				return response.json(); // wait to body data from server (PROMISE)
			})
			.then(function (body) {
				//   run after all body back from server
				console.log(body);

				setMessage({
					showMessage: true,
					messageSuccess: body.success,
				});
				setTaskInput({
					task: '',
					category: '',
					client: '',
				});
				setTimer({
					hours: 0,
					minutes: 0,
					seconds: 0,
				});
			})
			.then(getUserTasks)
			.then(getUser);

		fetch('http://localhost:5000/users/updateuser', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json', // body type
			},
			body: JSON.stringify({
				category: taskInput.category,
				client: taskInput.client,
				userEmail: user,
			}),
		})
			.then(function (response) {
				// run after get response from server
				console.log('res', response);
				return response.json(); // wait to body data from server (PROMISE)
			})
			.then(function (body) {
				//   run after all body back from server
				console.log(body);
			});
	}

	function watchReset() {
		clearInterval(intervalId);
		setIntervalId(null);
		setStartButton('Start');
		setClockState(States.PENDING);
		setTimer({
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
		setTaskInput({
			task: '',
			category: '',
			client: '',
		});
	}

	function messageClear() {
		setMessage({
			showMessage: false,
			messageSuccess: false,
		});
	}
	function getUserTasks() {
		fetch('http://localhost:5000/tasks/' + user, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // body type
			},
			body: JSON.stringify({
				clientFilter: filter.client,
				categoryFilter: filter.category,
			}),
		})
			.then(response => response.json())
			.then(data => {
				let h = 0;
				let m = 0;
				let s = 0;

				data.forEach(task => {
					h = h + task.duration.hours;
					m = m + task.duration.minutes;
					s = s + task.duration.seconds;
				});

				function sumTotDur(hrs, mins, secs) {
					m = Math.floor(m + s / 60);
					s = s % 60;
					h = Math.floor(h + m / 60);
					m = m % 60;

					return {
						hours: h,
						minutes: m,
						seconds: s,
					};
				}

				const td = sumTotDur(h, m, s);

				console.log('td', td);

				setTotalDuration(td);

				console.log(totalDuration);
				console.log('tableRef.current', tableRef.current);

				if (data.length >= tasksArray.length) {
					setTasksArray(data);

					tableRef.current && (tableRef.current.style.height = data.length * 35 + 35 + 'px');
				} else {
					tableRef.current && (tableRef.current.style.height = data.length * 35 + 35 + 'px');
					setTimeout(() => setTasksArray(data), 500);
				}
				// setTasksArray(data);
			});
	}

	// run code after every render

	function getUser() {
		fetch('http://localhost:5000/users/getfname/' + user)
			.then(response => response.json())
			.then(data => {
				setUserData(data);
			});
	}

	useEffect(() => {
		console.log('AAAA', tableRef);

		getUserTasks();

		getUser();
	}, [filter]);

	if (!user) {
		// if no user in local storage redirect to login
		return <Redirect to='/login' />;
	}

	const onDoneDisabled =
		!taskInput.task ||
		!taskInput.category ||
		!taskInput.client ||
		(timer.seconds === 0 && timer.minutes === 0 && timer.hours === 0);

	const onStartDisabled = !taskInput.task || !taskInput.category || !taskInput.client;

	console.log(clockState);
	return (
		<div>
			{console.log(tasksArray)}
			<header className='watch-header'>
				<h1 className='welcome'>Hi {userData && userData.fname}, get That work done!</h1>
				<p className='instructions'>
					Enter a new task and hit that "Start" button, you can always pause and resume, and when your finished with your
					task hit "Done".
				</p>
			</header>

			<Clock timer={timer} />
			<BtnsContainer
				onStart={watchToggle}
				onDone={watchDone}
				onDiscard={watchReset}
				startText={btnText[clockState]}
				onStartDisabled={onStartDisabled}
				onDoneDisabled={onDoneDisabled}
			/>

			<div className='inputs-container'>
				<Input onChange={handleInput2} name='task' placeholder='Enter task' value={taskInput.task} />
				<Input
					onChange={handleInput2}
					type='text'
					name='category'
					list='categoryList'
					placeholder='Category'
					value={taskInput.category}
					autoComplete='off'
				/>

				<datalist id='categoryList'>
					{userData &&
						userData.userCategories.map(category => {
							return <option>{category}</option>;
						})}
				</datalist>

				<input
					onChange={handleInput}
					name='client'
					list='clientList'
					placeholder='Enter Client'
					value={taskInput.client}
					autoComplete='off'
				/>

				<datalist id='clientList'>
					{userData &&
						userData.userClients.map(client => {
							return <option>{client}</option>;
						})}
				</datalist>
			</div>

			<h2>Search By</h2>

			<div className='filterContainer'>
				{/* <input onChange={handleInput} name='task' placeholder='Enter task' value={taskInput.task} autoComplete='off'></input> */}
				<input
					onChange={handleFilter}
					type='text'
					name='category'
					list='categoryList'
					placeholder='Category'
					value={filter.category}
					autoComplete='off'
				/>

				<datalist id='categoryList'>
					{userData &&
						userData.userCategories.map(category => {
							return <option>{category}</option>;
						})}
				</datalist>

				<input
					onChange={handleFilter}
					name='client'
					list='clientList'
					placeholder='Client'
					value={filter.client}
					autoComplete='off'
				/>

				<datalist id='clientList'>
					{userData &&
						userData.userClients.map(client => {
							return <option>{client}</option>;
						})}
				</datalist>
			</div>
			<TaskTable tasks={tasksArray} ref={tableRef} />
			<h3>
				Total task duration {('0' + totalDuration.hours.toString()).slice(-2)}:
				{('0' + totalDuration.minutes.toString()).slice(-2)}:{('0' + totalDuration.seconds.toString()).slice(-2)}
			</h3>
		</div>
	);
}

export default Stopwatch;
