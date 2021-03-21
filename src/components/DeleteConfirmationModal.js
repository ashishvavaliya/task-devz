import { Button, Modal } from 'react-bootstrap';
import React from 'react';
import HttpService from '../common/HttpService';
import APIConst from '../common/APIConst';
/**
 * Task Delete popup component to ask for confirmation to delete task
 * this component is loaded inside task list
 */
function DeleteConfirmationModal(prop) {
	const deleteTask = () => {
		const data = new FormData();
		data.append('taskid', prop.task.id);
		HttpService.httpPost(APIConst.TASK_DELETE,
			data)
			.then((res) => {
				console.log(res);
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
				Are you sure you want to delete task <b>{prop.task.message}</b> ?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={prop.closeModal}>
					Cancel
        </Button>
				<Button variant="danger" onClick={deleteTask}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default DeleteConfirmationModal;
