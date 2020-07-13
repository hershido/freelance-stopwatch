import React from 'react';

function Clock(props) {
	const { timer } = props;
	return (
		<div className='digits-container'>
			<div className='digits'>
				{('0' + timer.hours.toString()).slice(-2)}:{('0' + timer.minutes.toString()).slice(-2)}:
				{('0' + timer.seconds.toString()).slice(-2)}
			</div>
		</div>
	);
}

export default Clock;
