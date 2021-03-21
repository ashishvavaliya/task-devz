import { Card, Button, Dropdown, Form, Col, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HttpService from '../common/HttpService';
import APIConst from '../common/APIConst';
import AppConstant from '../common/AppConstant';
import AssignmentModal from './AssignmentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DatePicker from 'react-date-picker';

/**
 * Task List component to list out task
 * this component is loaded through routeer
 */
function TaskList() {
	const [taskList, setTaskList] = useState([]);
	const [userList, setUserList] = useState([]);
	const [isShowAssignModal, setIsShowAssignModal] = useState(false);
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
	const [selectedTask, setSelectedTask] = useState({});
	const [updateListCounter, setUpdateListCounter] = useState(0);
	const [searchText, setSearchText] = useState('');
	const [dueDate, setDueDate] = useState(null);
	const [priority, setPriority] = useState(0);
	const priorityList = AppConstant.PRIORITY_LIST;

	// Fetch user list when loading component
	React.useEffect(() => {
		HttpService.httpGet(APIConst.LIST_USER)
			.then((res) => {
				console.log(res);
				setUserList(res.users);
			});
	}, []);

	// Fetch TaskList after update
	React.useEffect(() => {
		HttpService.httpGet(APIConst.TASK_LIST)
			.then((res) => {
				console.log(res);
				setTaskList(res.tasks);
			});
	}, [updateListCounter]);

	function toggleAssingmentModal(task) {
		setIsShowAssignModal(!isShowAssignModal);
		setSelectedTask(task);
	}

	function toggleDeleteModal(task) {
		setIsShowDeleteModal(!isShowDeleteModal);
		setSelectedTask(task);
	}

	function fetchList() {
		setUpdateListCounter(updateListCounter + 1);
	}

	const changePriority = (event) => {
		setPriority(+event.target.value);
	}

	// Render individual tasks 
	function getTaskCard(task) {
		return (<Card border="primary">
			<Card.Body>
				<Card.Text>
					<Row>
						<Col>
							{task.message}
						</Col>
						<Col>
							<span>{task.due_date}</span>
						</Col>
						<Col>
							<span>{getPriorityName(task.priority)}</span>
						</Col>
						<Col>
							<span>{getUserNameFromId(task.assigned_to)}</span>
						</Col>
						<Col>
							<Dropdown>
								<Dropdown.Toggle id="dropdown-custom-1">Action</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item
										onClick={() => toggleAssingmentModal(task)}>Assign</Dropdown.Item>
									<Dropdown.Item
										href={'/create-task/' + task.id}>Edit</Dropdown.Item>
									<Dropdown.Item
										onClick={() => toggleDeleteModal(task)}>Delete</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>
				</Card.Text>
			</Card.Body>
		</Card>);
	}

	// Rendaer Assignement popup
	const renderAssignemntModal = () => {
		if (isShowAssignModal) {
			return (
				<AssignmentModal
					isShow={isShowAssignModal}
					userList={userList}
					closeModal={toggleAssingmentModal}
					updateList={fetchList}
					task={selectedTask}></AssignmentModal>);
		} else {
			return '';
		}
	}

	const getUserNameFromId = (id) => {
		return userList.find(user => user.id == id) ?
			userList.find(user => user.id == id).name : '';
	}

	const getPriorityName = (id) => {
		return priorityList.find(priority => priority.value == id) ?
			priorityList.find(priority => priority.value == id).name : '';
	}

	// Load delete task Modal
	const renderDeleteAssisgnmentModal = () => {
		if (isShowDeleteModal) {
			return (
				<DeleteConfirmationModal
					isShow={isShowDeleteModal}
					userList={userList}
					closeModal={toggleDeleteModal}
					updateList={fetchList}
					task={selectedTask}></DeleteConfirmationModal>);
		} else {
			return '';
		}
	}

	const isSameDate = (date1, date2) => {
		if (date1.getDate() == date2.getDate() &&
			date1.getFullYear() == date2.getFullYear() &&
			date2.getMonth() == date1.getMonth()) {
			return true;
		}
		return false;
	}

	// Filter Tasks based on selected property
	const getTaskListToShow = () => {
		// filter tasks by search
		let filteredTaks = [];
		if (searchText != '') {
			taskList.forEach(task => {
				if (task.message.toLowerCase().includes(searchText.toLowerCase())) {
					filteredTaks.push(task)
				}
			});
		} else {
			filteredTaks = taskList
		}
		console.log('da :', dueDate)

		// filter task by priority
		let filteredPriority = [];
		if (priority != 0) {
			filteredTaks.forEach(task => {
				if (task.priority.includes(priority)) {
					filteredPriority.push(task);
				}
			});
		} else {
			filteredPriority = filteredTaks;
		}

		// filter task by due date
		let filteredDueDate = [];
		if (dueDate) {
			filteredPriority.forEach(task => {
				if (isSameDate(new Date(task.due_date), dueDate)) {
					filteredDueDate.push(task)
				}
			});
		} else {
			filteredDueDate = filteredPriority;
		}
		return filteredDueDate;
	}

	return (
		<div className="App container">
			<h2>
				Task Manager
			</h2>
			<div className="Header d-flex">
				<div className="mr-auto">
					<h4>Task List</h4>
				</div>
				<Link to='/create-task'>
					<Button variant="primary"
						component={Link}
						to={'/create-task'} >Create New Task</Button>
				</Link>
			</div>
			{
				// filter and search section
			}
			<div className="search-bar">
				<Form.Group>
					<Form.Control type="text"
						value={searchText}
						onChange={e => { setSearchText(e.target.value) }}
						placeholder="Search by Name" />
				</Form.Group>
				<Row>
					<Col>
						<Row className="justify-content-md-center">
							<label>Filter by Due Date</label>
						</Row>
						<Row className="justify-content-md-center">
							<DatePicker
								onChange={setDueDate}
								value={dueDate}
							/>
						</Row>
					</Col>
					<Col>
						<Form.Group controlId="validationSelectPriority" className="">
							<Form.Label>Filter Priority</Form.Label>
							<Form.Control as="select"
								value={priority}
								onChange={changePriority}
								custom>
								<option value="0">All</option>
								{priorityList.map((priority) => {
									return (<option value={priority.value}>{priority.name}</option>)
								})}
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
			</div>
			<div className="task-list-contaiener">
				{ // for the header of task linst
				}
				<Card.Body>
					<Card.Text>
						<Row>
							<Col>
								<span>Name</span>
							</Col>
							<Col>
								<span>Due Date</span>
							</Col>
							<Col>
								<span>Priority</span>
							</Col>
							<Col>
								<span>Assigned To</span>
							</Col>
							<Col>
								<span>Action</span>
							</Col>
						</Row>
					</Card.Text>
				</Card.Body>
				{getTaskListToShow().map((task) => {
					return getTaskCard(task);
				})}
			</div>
			{renderAssignemntModal()}
			{renderDeleteAssisgnmentModal()}
		</div>
	);
}

export default TaskList;
