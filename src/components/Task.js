import {useState} from "react"
import ReactDom from 'react-dom'


const Task = (props) => {
    const [clicked, setClicked] = useState(props.initialState)
    const test1 = (
        <div id={'task' + props.taskId}>
            <input id={'taskTitle' + props.taskId} type="text" defaultValue={props.title}/>
            <input id={'taskDescription' + props.taskId} type="text" defaultValue={props.description}/>
            <button onClick={() => {
                console.log("I've tried to finish the edits")
                props.title=document.getElementById('taskTitle' + props.taskId).nodeValue
                props.description=document.getElementById('taskDescription' + props.taskId).nodeValue
                setClicked(!clicked)
            }}>Finish edits</button>
            <button onClick={() => {
                console.log("I've tried to cancel the edits")
                setClicked(!clicked)
            }}>Cancel</button>
        </div>
    )
    const test2 = (
        <div id={'task' + props.taskId}>
            <p>{props.title}</p><br/>
            <p>{props.description}</p>
            <button onClick={() => {
                console.log("I've tried to add a subtask")
                const thisComponent=document.getElementById('task' + props.taskId)
                const newNode=document.createElement('div')
                newNode.setAttribute('id','tempToReplace')
                thisComponent.parentNode.insertBefore(newNode, thisComponent.nextSibling)
                ReactDom.render(<Task
                    taskId={3}
                    initialState={true}
                    title={''}
                    description={''}
                />, newNode)
            }}>Add subtask
            </button>
        </div>
    )

    return (<div id={'task' + props.taskId}>
        {clicked ? test1 : test2}
        <button onClick={() => {
            setClicked(!clicked)
        }}>Click me
        </button>
    </div>)
}


export default Task