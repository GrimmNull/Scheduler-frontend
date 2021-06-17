import {useState} from "react"
import ReactDom from 'react-dom'
import '../stylesheets/task.scss'

const Task = (props) => {
    const [clicked, setClicked] = useState(props.initialState)
    const parentTaskId=props.parentTaskId
    const [description, setDescription] = useState(props.description)
    const [startTime, setStartTime] = useState(props.startTime)
    const [deadline, setDeadline] = useState(props.deadline)
    const editMode = (
        <div id={'taskEdit' + props.taskId}>
            <label> Description: </label>
            <input id={'DescriptionOfTask' + props.taskId} type="text" defaultValue={description}/><br/>
            <label> Start time: </label>
            <input id={'StartTime' + props.taskId} type="datetime-local" defaultValue={startTime}/><br/>
            <label> Deadline:</label>
            <input id={'Deadline' + props.taskId} type="datetime-local" defaultValue={deadline}/><br/>
            <button onClick={() => {
                setDescription(document.getElementById('DescriptionOfTask' + props.taskId).value)
                setStartTime(document.getElementById('StartTime' + props.taskId).value)
                setDeadline(document.getElementById('Deadline' + props.taskId).value)
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
        <div id={'taskDisplay' + props.taskId} onClick={() => {
            setClicked(!clicked)
        }}>
            <p>{description}</p>
            <p>{startTime}</p>
            <p>{deadline}</p>
            {parentTaskId ? '' :
            <button onClick={() => {
                const thisComponent = document.getElementById('taskDisplay' + props.taskId)
                const newNode = document.createElement('div')
                newNode.setAttribute('id', 'tempToReplace')
                thisComponent.parentNode.insertBefore(newNode, thisComponent.nextSibling)
                ReactDom.render(<Task
                    taskId={3}
                    initialState={true}
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