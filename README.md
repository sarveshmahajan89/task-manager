# Task Management Application using MERN stack

This application allows admin to add, edit, delete, and mark tasks as completed.
This project is made with ReactJs as a UI framework, bootstrap css library, ExpressJs for API service with Nodejs as server side serving for API calls management, and mongodb for database.

## Application features

- #### Login
    - Our assumption is user is already logged in.

- #### Dashboard view
    - Task performance at the top
    - Add/remove/update/view tasks in the list.
    - view task performance.

## Using this project

Clone the project, change into the directory and install the dependencies.

```bash
cd task-manager
npm install
```
## Using this project

Run the React application on its own with the command:

```bash
npm run start
```

Run the API server on its own with the command:

```bash
npm run server
```

Run both the applications together with the command:

```bash
npm run app-start
```
Note: If you're running this code locally, and facing "connection error: ERROR queryTxt EREFUSED", try using a different internet provider, like using your phone's hotspot instead of your home wi-fi or vice versa.
Some ISPs have trouble with Atlas.

Run automated tests()created using Enzype test API with the command:

```bash
npm run test
```
The React application will run on port 3001, while server is running at port 3000.
