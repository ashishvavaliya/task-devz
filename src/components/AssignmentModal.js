import { Button, Modal, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import HttpService from '../common/HttpService';
import APIConst from '../common/APIConst';

/**
 * Task Assignment popup component to assign task to user
 * this component is loaded inside task list
 */
function AssignmentModal(prop) {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUseer] = useState(prop.task.assigned_to);

	const changeAssignedUser = (event) => {
		setSelectedUseer(+event.target.value);
	}

	// call API to Update Assignee
	const updateAssignee = () => {
		const data = new FormData();
		data.append('message', prop.task.message);
		data.append('due_date', prop.task.due_date);
		data.append('priority', prop.task.priority);
		data.append('taskid', prop.task.id);
		data.append('assigned_to', selectedUser);
		HttpService.httpPost(APIConst.TASK_UPDATE,
			data)
			.then((res) => {
				console.log(res);
				// state.taskList = res.tasks;
				setUserList(res.users);
				prop.updateList();
				prop.closeModal();
			});
	}

	return (
		<Modal
			show={prop.isShow}
			backdrop="static"
			keyboard={false}
			onHide={prop.closeModal}
		>
			<Modal.Header closeButton>
				<Modal.Title>Assign Task to User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="exampleForm.SelectCustom">
						<Form.Label>Select User</Form.Label>
						<Form.Control as="select" custom
							value={selectedUser}
							onChange={changeAssignedUser}>
							{prop.userList.map((user) => {
								return (<option value={user.id}>{user.name}</option>)
							})}
						</Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={prop.closeModal}>
					Cancel
        </Button>
				<Button variant="primary" onClick={updateAssignee}>Assign</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AssignmentModal;
