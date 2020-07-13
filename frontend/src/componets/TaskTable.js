import React, { forwardRef } from 'react';

const TaskTable = forwardRef(function TaskTable(props, ref) {
	if (props.tasks.length < 1) {
		return <h2 className='catch'>No tasks in database</h2>;
	}

	const tableHeight = props.tasks.length * 35 + 35 + 'px';
	const tableHeightStyle = {
		height: tableHeight,
	};
	console.log(tableHeightStyle);

	return (
		<div className='table-box' ref={ref}>
			<table className='task-table-container'>
				<tbody>
					<tr>
						<th>Task</th>
						<th>Category</th>
						<th>Client</th>
						<th>Duration</th>
					</tr>
					{props.tasks
						.slice(0)
						.reverse()
						.map(task => {
							const durHours = `0${task.duration.hours}`.slice(-2);
							const durMinutes = `0${task.duration.minutes}`.slice(-2);
							const durSeconds = `0${task.duration.seconds}`.slice(-2);
							return (
								<tr>
									<td>{task.taskTitle}</td>
									<td>{task.taskCategory}</td>
									<td>{task.clientName}</td>
									<td>
										{durHours}:{durMinutes}:{durSeconds}
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
});

export default TaskTable;
