import React from 'react';

function Input(props) {
	function handleInput(event) {
		console.log('handleInput');
		const value = event.target.value;
		const fieldName = event.target.name;

		props.onChange && props.onChange(fieldName, value);
	}
	return (
		<input onChange={handleInput} name={props.name} placeholder={props.placeholder} value={props.value} autoComplete='off' />
	);
}

export default Input;
