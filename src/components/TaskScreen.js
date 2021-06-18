import Task from "./Task";
import {useEffect, useState} from "react";
import ReactDom from "react-dom";

async function fetchRootTasks() {
    const rootTasks = await (await fetch(`http://localhost:8000/users/tasks/1?rootOnly=true`, {
        method: 'GET'
    })).json()
    return rootTasks.results
}

async function fetchSubTasks(id) {
    const subtasks = await (await fetch(`http://localhost:8000/tasks/subtasks/${id}`, {
        method: 'GET'
    })).json()
    return subtasks.results
}

async function addSubTasks() {
    const results = await fetchRootTasks()
    let lista = results.map(async task => {
        const subtasks = await fetchSubTasks(task.taskId)
        return [].concat(task, subtasks)
    })
    return lista

}

async function fetchTasks(setter) {
    setter('')
    const promisedResults = await addSubTasks()
    Promise.all(promisedResults).then((res) => {
            const taskScreen = res.flat(1).map(task => {
                if (task) {
                    return <Task
                        taskId={task.taskId}
                        initialState={false}
                        parentTaskId={task.parentTaskId}
                        title={task.title}
                        description={task.description}
                        startTime={task.startTime}
                        deadline={task.deadline}
                    />
                } else {
                    return <br/>
                }
            })
            setter(taskScreen)
        }
    )

}

function TaskScreen(props) {
    const [rootTasks, setRootTasks] = useState('')
    const taskPage=(
        <div>
            <button onClick={() => {
                const thisComponent = document.getElementById('taskDisplay1')
                const newNode = document.createElement('div')
                newNode.setAttribute('id', 'tempToReplace')
                thisComponent.parentNode.insertBefore(newNode, thisComponent)
                ReactDom.render(<Task
                    initialState={true}
                    title={''}
                    description={''}
                />, newNode)
            }}>
                Add task
            </button>
            {rootTasks}
        </div>
    )
    useEffect(() => {
        fetchTasks((setRootTasks))
    }, [])
    return rootTasks === '' ? (<h1>Fetching your tasks right now...</h1>) : (taskPage)
}

export default TaskScreen