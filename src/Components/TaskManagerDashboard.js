import { useState, useEffect, useMemo } from 'react';
import {Card, Col, Container, ProgressBar, Row, Table, Button, InputGroup, Form, Modal, FloatingLabel} from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import common from "../common";
import Toast from "light-toast";
const initCheckBoxes = (taskList) => {
    const updateTaskList = [...taskList];
    updateTaskList.map((item, index) => {
        item.checked = false;
    });
    return updateTaskList;
};
const getStatusCount = (taskList) => {
    let result = {
        open: 0,
        progress: 0,
        resolved: 0
    }
    result = taskList.reduce((acc, val) => {

        if (val.status === 'open') {
            acc.open = acc.open + 1;
        }
        else if (val.status === 'progress') {
            acc.progress = acc.progress + 1;
        }
        else {
            acc.resolved = acc.resolved + 1;
        }
        return acc
    }, result);

    result.open = ((result.open/taskList.length) * 100).toFixed(2);
    result.progress = ((result.progress/taskList.length) * 100).toFixed(2);
    result.resolved = ((result.resolved/taskList.length) * 100).toFixed(2);
    return result;
}
const TaskManagerDashboard = (props) => {
    const [showTaskModal, setShowTaskModal] = useState(false),
        [showDeleteModal, setShowDeleteModal] = useState(false),
        [isTaskUpdateMode, setIsTaskUpdateMode] = useState(false),
        [taskInputFieldsVal, setTaskInputFieldsVal] = useState({}),
        [existingTaskList, setExistingTaskList] = useState(props.existingTaskList),
        [selectedRow, setSelectedRow] = useState([]),
        [headerCheckedStatus, setHeaderCheckedStatus] = useState(false),
        [filterTaskData, setFilterTaskData] = useState(initCheckBoxes(existingTaskList)),
        [validated, setValidated] = useState(false),
        [searchString, setSearchString] = useState(''),
        [taskListStatusCount, setTaskListStatusCount] = useState(getStatusCount(existingTaskList));

    const onCheckClick = e => {
        e.stopPropagation();
    }
    const onHeaderCheckClick = e => {
        e.stopPropagation();
    }

    const handleFormFieldChange = e => {
        let val = e.target.value;
        setTaskInputFieldsVal(prevState => ({ ...prevState, [e.target.name]: val }));
    }
    const handleSearch = e => {
        const val = e.target.value;
        setSearchString(val);
    }

    const updateSelectedRow = index => {
        const val = existingTaskList[index];
        setTaskInputFieldsVal(val);
        setIsTaskUpdateMode(true);
        setShowTaskModal(true);
    }

    const handleSubmit = (event) => {
        console.log(taskInputFieldsVal);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        else {
            if (isTaskUpdateMode) {
                const url = common.urls.update_task, data = JSON.stringify({
                    title: taskInputFieldsVal.title,
                    description: taskInputFieldsVal.description,
                    dewDate: taskInputFieldsVal.dewDate,
                    status: taskInputFieldsVal.status
                });
                axios.post(url, data)
                    .then(response => {
                        if (response.data.status === "success") {
                            setShowTaskModal(false);
                            Toast.success(`Task record updated for: ${taskInputFieldsVal.title}`, 2000);
                            setExistingTaskList(response.data.tasks);
                        }
                        else {
                            console.error(response.data.message, 2000);
                        }
                    })
                    .catch(error => {
                        console.error('Something went wrong!', error);
                    });
            }
            else {
                const url = common.urls.add_task, data = JSON.stringify(taskInputFieldsVal);
                axios.post(url, data)
                    .then(response => {
                        if (response.data.status === "success") {
                            setShowTaskModal(false);
                            Toast.success(`News task ${taskInputFieldsVal.title} added`, 2000);
                            setExistingTaskList(response.data.tasks);
                        }
                        else {
                            console.error(response.data.message, 2000);
                            Toast.fail(response.data.message, 2000);
                        }
                    })
                    .catch(error => {
                        console.error('Something went wrong!', error);
                        Toast.fail(error, 2000);
                    });
            }
        }

        setValidated(true);
    };

    const getAlertVariant = (status) => {
        return status === 'open' ? 'danger' : status === 'progress' ? 'warning' : 'success';
    }

    const handleTaskModalClose = () => setShowTaskModal(false);
    const handleDeleteClose = () => setShowDeleteModal(false);
    const handleCheckOnChange = (item) => {
        setFilterTaskData(filterTaskData.map((d) =>
                d.title === item.title ? { ...d, checked: !d.checked } : d
            )
        );
    }
    const onHeaderChange = (item) => {
        setHeaderCheckedStatus(prevState => !prevState);
        setFilterTaskData(filterTaskData.map((d) =>
                d.checked ? { ...d, checked: false } : { ...d, checked: true }
            )
        );
    }
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    }
    const handleRowDelete = () => {
        const url = common.urls.delete_task, data = JSON.stringify({title: selectedRow});
        axios.post(url, data)
            .then(response => {
                if (response.data.status === 'success') {
                    setShowDeleteModal(false);
                    Toast.success(`Selected rows ${selectedRow} has been deleted`, 2000);
                    setExistingTaskList(response.data.tasks);
                }
                else {
                    console.error('Something went wrong!');
                    Toast.fail('Something went wrong!', 2000);
                }
            })
            .catch(error => {
                console.error('Something went wrong!', error);
                Toast.fail(error, 2000);
            });
    }
    const handleTaskModalShow = () => {
        const date = new Date().setDate(new Date().getDate()),
            defaultFormData = {
                title: '',
                description: '',
                dewDate: moment(date).format("YYYY-MM-DD"),
                status: 'open'
            }
        setTaskInputFieldsVal(defaultFormData);
        setIsTaskUpdateMode(false);
        setShowTaskModal(true);
    }

    useEffect(() => {
        setTaskListStatusCount(getStatusCount(existingTaskList));
        setFilterTaskData(existingTaskList);
    }, [existingTaskList]);

    useEffect(() => {
        const selectedRowCount = filterTaskData.filter(item => item.checked).length,
            totalRowCount = filterTaskData.length;
        setSelectedRow(filterTaskData.filter(item => item.checked).map(item => item.title));
        setHeaderCheckedStatus(selectedRowCount === totalRowCount);
    }, [filterTaskData])

    useEffect(() => {
        if (searchString.length >= 0) {
            const filteredData = existingTaskList.filter(item => item.title.includes(searchString) || item.description.includes(searchString) || item.dewDate.includes(searchString) || item.status.includes(searchString));
            setFilterTaskData(filteredData);
        }
    }, [searchString])
  return (
        <div className={'task-dashboard'}>
            <Container>
                <Row className={'card-row'}>
                    <Col md={4}>
                        <Card>
                            <Card.Header as="h5">Completion status</Card.Header>
                            <Card.Body>
                                <Card.Text>Overall Completed task progress in %</Card.Text>
                                <ProgressBar className={'progress-container'} variant="success" now={taskListStatusCount.resolved} label={taskListStatusCount.resolved} key={1} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Header as="h5">In Progress status</Card.Header>
                            <Card.Body>
                                <Card.Text>Overall in progress task count in %</Card.Text>
                                <ProgressBar className={'progress-container'} variant="warning" now={taskListStatusCount.progress} label={taskListStatusCount.progress} key={2} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Header as="h5">Open status</Card.Header>
                            <Card.Body>
                                <Card.Text>Overall list of incomplete task count in %</Card.Text>
                                <ProgressBar className={'progress-container'} variant="danger" now={taskListStatusCount.open} label={taskListStatusCount.open} key={3} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className={'card-row'}>
                    <Col>
                        <Card>
                            <Card.Header as="h5">Task list</Card.Header>
                            <Card.Body>
                                <Row className={'toolbar'}>
                                    <Col md={4}>
                                        <Button variant="outline-secondary" onClick={handleTaskModalShow} className={'add-new'}><i className="fa fa-plus"></i>New task</Button>
                                    </Col>
                                    <Col md={{ span: 3, offset: 3 }} className={'align__right'}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="basic-addon1"><i className="fa fa-search"></i></InputGroup.Text>
                                            <Form.Control
                                                placeholder="search"
                                                aria-label="search"
                                                aria-describedby="basic-addon1"
                                                value={searchString}
                                                onChange={handleSearch}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={2} className={'align__right'}>
                                        <Button variant="outline-secondary" disabled={selectedRow.length === 0} onClick={handleDeleteClick}><i className="fa fa-trash"></i></Button>
                                    </Col>
                                </Row>
                                <Table hover responsive="lg">
                                    <thead>
                                    <tr>
                                        <th>
                                            <Form.Check
                                                className={'grid-check'}
                                                type={'checkbox'}
                                                onClick={onHeaderCheckClick}
                                                onChange={onHeaderChange}
                                                checked={headerCheckedStatus}
                                                id={`checkbox-header`}
                                            />
                                        </th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Due date</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filterTaskData.map((item, index) => {
                                            return (
                                                <tr className={'selected-row'} key={'row'+index} onClick={() => updateSelectedRow(index)}>
                                                    <td>
                                                        <Form.Check
                                                            className={'grid-check'}
                                                            onClick={onCheckClick}
                                                            type="checkbox"
                                                            id={`custom-checkbox-${item.title}`}
                                                            name={item.title}
                                                            checked={item.checked}
                                                            onChange={() => handleCheckOnChange(item)}
                                                        />
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.dewDate}</td>
                                                    <td>
                                                        <Button variant={getAlertVariant(item.status)}>
                                                            {item.status}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal size="lg" show={showTaskModal} onHide={handleTaskModalClose}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isTaskUpdateMode ? 'Update task' : 'Add Task'}</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                        <Container>
                            <Row>
                                <Col xs={6} md={6}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Title"
                                        className="mb-3"
                                    >
                                        <Form.Control required type="text" placeholder="title" name='title' value={taskInputFieldsVal.title || ''} onChange={handleFormFieldChange} />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={6} md={6}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Description"
                                        className="mb-3"
                                    >
                                        <Form.Control required type="textarea" placeholder="task details" name='description' value={taskInputFieldsVal.description || ''} onChange={handleFormFieldChange} />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} md={6}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Due date"
                                        className="mb-3"
                                    >
                                        <Form.Control required type="date" placeholder="target date" name='dewDate' value={taskInputFieldsVal.dewDate || ''} onChange={handleFormFieldChange} />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={6} md={6}>
                                    <FloatingLabel controlId="floatingSelect" label="Status">
                                        <Form.Select required disabled={!isTaskUpdateMode} aria-label="Floating label select example" name='status' value={taskInputFieldsVal.status || 'open'} onChange={handleFormFieldChange}>
                                            <option value="open">Open</option>
                                            <option value="progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleTaskModalClose}>
                            Close
                        </Button>
                        <Button type="submit">
                            {isTaskUpdateMode ? 'Update task' : 'Add task'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete task: {selectedRow.join(', ')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete these tasks ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRowDelete}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
  );
}

export default TaskManagerDashboard;
