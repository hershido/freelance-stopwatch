import React from 'react';

function BtnsContainer(props) {
	const { onStart, onDone, onDiscard, startText, onStartDisabled, onDoneDisabled } = props;

	return (
		<div className='button-container'>
			<button className='control-btn start-button' disabled={onStartDisabled} onClick={onStart}>
				{startText}
			</button>
			<button className='control-btn done-button' disabled={onDoneDisabled} onClick={onDone}>
				Done
			</button>
			<button onClick={onDiscard} className='control-btn reset-button'>
				Discard
			</button>
		</div>
	);
}

export default BtnsContainer;
