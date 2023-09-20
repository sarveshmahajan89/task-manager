const baseUrl = 'http://localhost:3000';

// common js file to serve all modules common features
const common = {
    urls: {
        login: baseUrl + '/login',
        delete_task: baseUrl + '/delete_task',
        update_task: baseUrl + '/update_task',
        add_task: baseUrl + '/add_task',
        get_tasks: baseUrl + '/tasks'
    }
};

export default common;