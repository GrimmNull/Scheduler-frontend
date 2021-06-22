import {useEffect, useState} from "react"
import ReactDom from 'react-dom'
import '../stylesheets/task.scss'
import triggerAlert from "../triggerAlert";


const userToken=sessionStorage.getItem('token')

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
    const editMode = (
        <div id={'taskEdit' + taskId}>
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
                    token: userToken,
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        columns: 'description startTime deadline',
                        description: document.getElementById('DescriptionOfTask' + taskId).value,
                        startTime: document.getElementById('StartTime' + taskId).value,
                        deadline: document.getElementById('Deadline' + taskId).value
                    })
                }).then(res => res.json())
                    .then(result => triggerAlert(result.message))
                setClicked(!clicked)
            }}>Finish edits
            </button>
            <button onClick={() => {
                setClicked(!clicked)
            }}>Cancel
            </button>
        </div>
    )
    const displayMode = (
        <div id={'taskDisplay' + taskId} onClick={() => {
            setClicked(!clicked)
        }}>
            <p>{description}</p>
            <p>{startTime}</p>
            <p>{deadline}</p>
            {parentTaskId ? '' :
                <button onClick={() => {
                    const thisComponent = document.getElementById('taskDisplay' + taskId)
                    const newNode = document.createElement('div')
                    newNode.setAttribute('id', 'tempToReplace')
                    thisComponent.parentNode.insertBefore(newNode, thisComponent.nextSibling)
                    ReactDom.render(<Task
                        initialState={true}
                        parentTaskId={taskId}
                        title={''}
                        description={''}
                    />, newNode)
                }}>Add subtask
                </button>}
        </div>
    )

    return !clicked ? displayMode : editMode
}


export default Task