import '../scss/App.scss';
import Footer from './Footer';
import Header from './Header';
import TaskManagerDashboard from './TaskManagerDashboard';
import NavBarContainer from './NavBarContainer';
import {useEffect, useState} from "react";
import common from "../common";
import axios from "axios";
import Toast from "light-toast";
import {Modal, Spinner} from "react-bootstrap";

function App() {
    const [existingTaskList, setExistingTaskList] = useState([]),
        [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const url = common.urls.get_tasks;
        setShowSpinner(true);
        axios.get(url)
            .then(response => {
                if (response.data.length > 0) {
                    setExistingTaskList(response.data);
                }
                else {
                    console.error(response.data.message, 2000);
                    Toast.fail(response.data.message, 2000);
                }
            })
            .catch(error => {
                console.error('Something went wrong!', error);
            })
            .finally(() => {
                setShowSpinner(false);
            });
    }, []);

  return (
    <div className="App">

        <NavBarContainer></NavBarContainer>
        <Header>
        </Header>

        {existingTaskList.length > 0 && <TaskManagerDashboard existingTaskList={existingTaskList}></TaskManagerDashboard>}

        <Modal size="sm" show={showSpinner}>
            <Spinner animation="grow" size="md" />
        </Modal>

        <Footer>
        </Footer>
    </div>
  );
}

export default App;