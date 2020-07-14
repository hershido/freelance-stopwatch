import React, { useState } from 'react';

// 1) filll form
// 2) send to server
// 3) if valid data - redicert to home page, and save user in local storage
// if not valid data - show error message

function Login(props) {
	console.log('login props', props);

	const [form, setForm] = useState({ email: '', password: '' });
	function onSubmit(event) {
		// prevet default form behavior
		event.preventDefault();
		const email = event.target.email.value;
		const password = event.target.password.value;

		// validate data in server (Fetch)
		fetch('approutes/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // body type
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then(function (response) {
				// run after get response from server
				console.log('res', response);
				return response.json(); // wait to body data from server (PROMISE)
			})
			.then(function (body) {
				//   run after all body back from server
				if (body.message === 'Success') {
					localStorage.setItem('loggedinUser', JSON.stringify(email));
					props.history.push('/');
				} else {
					props.history.push('/register');
				}
				console.log(body);
			});
		// if success

		// save user form server in local storage

		// redirect to home
	}

	function onChange(event) {
		{
			const { name, value } = event.target;
			setForm({ ...form, [name]: value });
		}
	}

	console.log('form', form);

	return (
		<div>
			<header className='log-header'>
				<h1 className='welcome'>Welcome To StopWatch</h1>
				<h2 className='catch'>Time Mangement for the professional freelancer</h2>
			</header>
			<div className='login-container'>
				<h2 className='please'>Please Sign In</h2>

				<form onSubmit={onSubmit}>
					<label For='loginemail'>Email</label>
					<input className='user-login' id='loginemail' value={form.email} name='email' onChange={onChange} /> <br />
					<label For='loginpassword'>Password</label>
					<input className='user-login' id='loginpassword' type='password' name='password' value={form.password} onChange={onChange} /> <br />
					<button className='control-btn start-button login-btn' type='sumbit'>
						Log in
					</button>
					<br />
					<p>Or</p>
					<a href='/register'>Register as a new user</a>
				</form>
			</div>
		</div>
	);
}

export default Login;
