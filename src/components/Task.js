import {useEffect, useState} from "react"
import ReactDom from 'react-dom'
import '../stylesheets/task.scss'
import * as ReactDOM from "react-dom";
import {Alert} from "antd";


const userToken = sessionStorage.getItem('token')

const Task = (props) => {
    const [clicked, setClicked] = useState(props.initialState)
    const parentTaskId = props.parentTaskId
    const [taskId, setTaskId] = useState(null)
    useEffect(() => {
        if (props.taskId) {
            setTaskId(props.taskId)
        } else {
            console.log(props)
            fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ownerToken: userToken,
                    type: 'temp',
                    parentTaskId: parentTaskId
                })
            }).then(res => res.json())
                .then(result => {
                    setTaskId(result.taskId)
                })
        }
    }, [parentTaskId, props])
    const [description, setDescription] = useState(props.description)
    const [startTime, setStartTime] = useState(props.startTime)
    const [deadline, setDeadline] = useState(props.deadline)
    const [completed, setCompleted] = useState(props.completed)
    const [failed, setFailed] = useState(props.failed)
    const editMode = (
        <div id={'taskEdit' + taskId}
             class={`${parentTaskId !== null ? 'subtask' : 'task'} ${completed ? 'completed' : failed ? 'failed' : 'pending'}`}>
            <label> Description: </label>
            <input id={'DescriptionOfTask' + taskId} type="text" defaultValue={description}/><br/>
            <label> Start time: </label>
            <input id={'StartTime' + taskId} type="datetime-local" defaultValue={startTime}/><br/>
            <label> Deadline:</label>
            <input id={'Deadline' + taskId} type="datetime-local" defaultValue={deadline}/><br/>
            <button onClick={() => {
                setDescription(document.getElementById('DescriptionOfTask' + taskId).value)
                setStartTime(document.getElementById('StartTime' + taskId).value)
                setDeadline(document.getElementById('Deadline' + taskId).value)
                fetch(`http://localhost:8000/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ownerToken: userToken,
                        columns: 'description startTime deadline',
                        description: document.getElementById('DescriptionOfTask' + taskId).value,
                        startTime: document.getElementById('StartTime' + taskId).value,
                        deadline: document.getElementById('Deadline' + taskId).value
                    })
                }).then(res => res.json())
                    .then(result => ReactDOM.render(
                        <Alert message={result.message} type="success" />,
                        document.getElementById('container'),
                    ))
                setClicked(!clicked)
            }}>Finish edits
            </button>
            <button onClick={() => {
                fetch()
            }}>
                Delete {parentTaskId !== null ? 'subtask' : 'task'}
            </button>
            <button onClick={() => {
                setClicked(!clicked)
            }}>Cancel
            </button>
        </div>
    )
    const displayMode = (
        <div id={'taskDisplay' + taskId}
             class={`${parentTaskId !== null ? 'subtask' : 'task'} ${completed ? 'completed' : failed ? 'failed' : 'pending'}`}>
            <p>Description: {description}</p>
            <p>Start time: {startTime}</p>
            <p>Deadline: {deadline}</p>
            {parentTaskId ? '' :
                <button onClick={() => {
                    const thisComponent = document.getElementById('taskDisplay' + taskId)
                    const newNode = document.createElement('div')
                    newNode.setAttribute('id', 'tempToReplace')
                    thisComponent.parentNode.insertBefore(newNode, thisComponent.nextSibling)
                    ReactDom.render(<Task
                        initialState={true}
                        parentTaskId={taskId}
                        completed={false}
                        failed={false}
                        title={''}
                        description={''}
                    />, newNode)
                }}>Add subtask
                </button>}
            <button onClick={() => {
                setClicked(!clicked)
            }}>
                Edit {parentTaskId !== null ? 'subtask' : 'task'}
            </button>
            <button onClick={
                () => {
                    const status = !completed
                    setCompleted(status)
                    fetch(`http://localhost:8000/tasks/completed/${taskId}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            ownerToken: sessionStorage.getItem('token'),
                            completed: status,
                            root: parentTaskId === null
                        })
                    }).then(res => res.json())
                        .then(result => ReactDOM.render(
                            <Alert message={result.message} type="success" />,
                            document.getElementById('container'),
                        ))
                }}>
                {!completed ? parentTaskId !== null ? 'Complete subtask' : 'Complete task' : 'Not finished'}
            </button>
        </div>
    )

    return !clicked ? displayMode : editMode
}


export default Task