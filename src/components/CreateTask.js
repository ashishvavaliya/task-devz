import { Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HttpService from '../common/HttpService';
import APIConst from '../common/APIConst';
import AppConstant from '../common/AppConstant';

/**
 * Task Create component to create task.
 * this component is loaded through router
 */
function CreateTask(props) {
	const [validated, setValidated] = useState(false);
	const [isShowForm, setIsShowForm] = useState(false);
	const [userList, setUserList] = useState([]);
	const [dueDate, setDueDate] = useState('2021-09-18 12:12:12');
	const [message, setMessage] = useState('');
	const [priority, setPriority] = useState(1);
	const [assignee, setAssignee] = useState(1);
	const [isRedirect, setIsRedirect] = useState(false);
	const { id } = props.match.params;
	const priorityList = AppConstant.PRIORITY_LIST;

	// load task data and user list initially
	React.useEffect(() => {
		if (!id) {
			setIsShowForm(true);
		}
		HttpService.httpGet(APIConst.LIST_USER)
			.then((res) => {
				console.log(res);
				setUserList(res.users);
			});
		HttpService.httpGet(APIConst.TASK_LIST)
			.then((res) => {
				console.log(res);
				res.tasks.map((task) => {
					if (task.id == id) {
						setMessage(task.message);
						setAssignee(task.assigned_to);
						setDueDate(task.due_date);
						setPriority(task.priority);
						setIsShowForm(true);
					}
				})
			});
	}, []);

	// call create task API
	const createTask = () => {
		const data = new FormData();
		data.append('message', message);
		data.append('due_date', dueDate);
		data.append('priority', priority);
		data.append('assigned_to', assignee);
		HttpService.httpPost(APIConst.TASK_CREATE,
			data)
			.then((res) => {
				console.log(res);
				setIsRedirect(true);
			});
	}

	// call update task API
	const updateTask = () => {
		const data = new FormData();
		data.append('message', message);
		data.append('due_date', dueDate);
		data.append('priority', priority);
		data.append('taskid', id);
		data.append('assigned_to', assignee);
		HttpService.httpPost(APIConst.TASK_UPDATE,
			data)
			.then((res) => {
				console.log(res);
				setIsRedirect(true);
			});
	}

	const changeAssignee = (event) => {
		setAssignee(+event.target.value);
	}

	const changePriority = (event) => {
		setPriority(+event.target.value);
	}

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		event.preventDefault();
		event.stopPropagation();
		if (form.checkValidity() === false) {
			return;
		}
		if (id) {
			updateTask();
		} else {
			createTask();
		}
		setValidated(true);
	};

	// redirect to home page.
	const redirectToList = () => {
		if (isRedirect) {
			return (
				<Redirect to="/" />
			)
		}
	}

	const showForm = () => {
		if (isShowForm) {
			return (
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Row>
						<Form.Group controlId="validationTitile">
							<Form.Label>Task name</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder="Task name..."
								defaultValue={message}
								onChange={e => { setMessage(e.target.value) }}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid Task name.</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>
					<Form.Row>
						<Form.Group controlId="validationDueDate">
							<Form.Label>Due Date</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder="Due date format '2021-09-18 12:12:12'"
								defaultValue={dueDate}
								onChange={e => { setDueDate(e.target.value) }}
							/>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid">
								Please provide a Due Date.</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>
					<Form.Row>
						<Form.Group controlId="validationSelectUser">
							<Form.Label>Select User</Form.Label>
							<Form.Control as="select"
								value={assignee}
								onChange={changeAssignee} custom>
								{userList.map((user) => {
									return (<option value={user.id}>{user.name}</option>)
								})}
							</Form.Control>
						</Form.Group>
					</Form.Row>
					<Form.Row>
						<Form.Group controlId="validationSelectPriority">
							<Form.Label>Select Priority</Form.Label>
							<Form.Control as="select"
								value={priority}
								onChange={changePriority}
								custom>
								{priorityList.map((priority) => {
									return (<option value={priority.value}>{priority.name}</option>)
								})}
							</Form.Control>
						</Form.Group>
					</Form.Row>
					<Button type="submit">Submit form</Button>
				</Form>
			)
		}
	}

	return (
		<div className="App container">
			<h2>
				Task Manager
			</h2>
			<div className="Header d-flex">
				<div className="mr-auto">
					<h4>Create Task</h4>
				</div>
				<Link to='/'>
					<Button variant="primary"
						component={Link} to={'/'} >Back to List</Button></Link>
			</div>
			<div className="create-task-container">
				{showForm()}
			</div>
			{redirectToList()}
		</div>
	);
}

export default CreateTask;
