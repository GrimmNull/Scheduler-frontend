import './App.css';
import Task from './components/Task.js'
import {useEffect, useRef} from "react";

function App() {
    let nrOfTasks=0
    const fetchingScreen= (
        <h1>We are now fetching your tasks...</h1>
    )

    let taskScreen=useRef('')
    useEffect(() => {
        fetch('http://localhost:8000/users/tasks/1',{
            method: "GET"
        }).then(res => res.json())
            .then((result) => {
                taskScreen.current=result.results.map(task=> <Task
                        taskId={task.taskId}
                        initialState={false}
                        title={task.title}
                        description={task.description}
                        startTime={task.startTime}
                        deadline={task.deadline}
                    />)
            }
            )}, [])

    return taskScreen.current==="" ? fetchingScreen : <div>{taskScreen.current} </div>

}

export default App;
