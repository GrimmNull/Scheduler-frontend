import {useEffect, useState} from "react"
import ReactDom from 'react-dom'
import '../stylesheets/task.scss'
import * as ReactDOM from "react-dom";
import {Alert} from "antd";
import DateTimePicker from 'react-datetime-picker';
var dateFormat = require('dateformat');
require('dotenv').config();


const userToken = sessionStorage.getItem('token')


const Task = (props) => {
    const [clicked, setClicked] = useState(props.initialState)  //starea care ne spune pe ce ecran ar trebui sa fim
    const parentTaskId = props.parentTaskId
    const [taskId, setTaskId] = useState(null)          //cand creem un task avem nevoie de un id de pe backend, asa ca-l initializam cu null
    useEffect(() => {
        if (props.taskId) {
            //daca am primit deja unul din props atunci ne oprim aici
            setTaskId(props.taskId)
        } else {
            //daca nu, atunci facem un request ca sa fie creat un task al carui id ne va fi returnat
            fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ownerToken: userToken,
                    type: 'temp',
                    parentTaskId: parentTaskId
                })
            }).then(res => res.json())
                .then(result => {
                    //daca merge totul bine, atunci ii punem task-ului id-ul pe care l-am primit de la server
                    setTaskId(result.taskId)
                })
        }
    }, [parentTaskId, props])
    const [description, setDescription] = useState(props.description)
    const [startTime, setStartTime] = useState(props.startTime ? props.startTime : new Date())
    const [deadline, setDeadline] = useState(props.deadline ? props.deadline : new Date())
    const [completed, setCompleted] = useState(props.completed)     //descrie daca un task/subtask a fost finalizat sau nu
    const [failed, setFailed] = useState(props.failed)              //descrie daca un task/subtask a fost ratat sau nu

    //ecranul pentru detalii este alcatuit in principal din informatiile despre task-uri/subtask-uri si o serie de butoane
    //prima data verificam daca este task sau subtask, iar apoi daca acesta a fost finalizat sau ratat
    const displayMode = (
        <div id={'taskDisplay' + taskId}
             class={`${parentTaskId !== null ? 'subtask' : 'task'} ${completed ? 'completed' : failed ? 'failed' : 'pending'}`}>
            <p>Description: {description}</p>
            <p>Start time: {dateFormat(startTime,'dd/m/yyyy, h:MM:ss TT')}</p>
            <p>Deadline: {dateFormat(deadline,'dd/m/yyyy, h:MM:ss TT')}</p>

            {//un subtask n-are subtask-uri la randul lui, asa ca ne asiguram ca doar un task normal poate sa-si adauge subtask-uri
                parentTaskId ? '' :
                    <button onClick={() => {
                        //vrem sa inseram un nou subtask inainte de urmatorul task, motiv pentru care preluam in felul asta locul unde va fi randat noul subtask
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
                //butonul de edit doar updateaza starea pentru a schimba pe celalalt ecran
                setClicked(!clicked)
            }}>
                Edit {parentTaskId !== null ? 'subtask' : 'task'}
            </button>
            <button onClick={
                () => {
                    //in functie de rezultatul actiunilor, user-ul va primi o notificare de tip alert cu un mesaj sugestiv. Notificarea aceasta o vom insera la inceputul
                    //paginii, motiv pentru care ne pregatim din start un nod unde sa randam notificarea
                    const main = document.getElementById('taskPageStart')
                    const newNode = document.createElement('div')
                    main.parentNode.insertBefore(newNode, main)

                    const status = !completed
                    setCompleted(status)
                    fetch(`${process.env.REACT_APP_API_URL}/tasks/completed/${taskId}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            ownerToken: sessionStorage.getItem('token'),
                            completed: status,
                            root: parentTaskId === null
                        })
                    }).then(res => res.json())
                        .then(result => {
                            if (result.message.includes('successfully')) {
                                //in caz ca task-ul/subtask-ul a fost updatat cu succes reincarcam pagina pentru a face rost din nou de task-uri de pe backend
                                //motivul pentru care facem asta este ca daca toate subtask-urile au fost completate, atunci si task-ul principal a fost terminat
                                //daca task-ul principal a fost terminat, dar vrem sa mai facemm ceva la el si ii modificam status-ul in neterminat,
                                // atunci nici subtask-urile nu putem spune ca au fost terminate
                                window.location.reload()
                                ReactDOM.render(
                                    <Alert message={result.message} type="success" closeText="Close Now"/>, newNode,
                                )
                            } else {
                                ReactDOM.render(
                                    <Alert message={result.message} type="error" closeText="Close Now"/>, newNode,
                                )
                            }

                        })
                }}>
                {!completed ? parentTaskId !== null ? 'Complete subtask' : 'Complete task' : 'Not finished'}
            </button>
        </div>
    )

    //este destul de similara cu fereastra de login, doar ca avem input-uri cu detaliile task-ului, iar noi le putem modifica
    const editMode = (
        <div id={'taskEdit' + taskId}
             class={`${parentTaskId !== null ? 'subtask' : 'task'} ${completed ? 'completed' : failed ? 'failed' : 'pending'}`}>
            <label> Description: </label>
            <input id={'DescriptionOfTask' + taskId} type="text" defaultValue={description}/><br/>
            <label> Start time: </label>
            <DateTimePicker
            onChange={setStartTime}
            value={new Date(startTime)}
            format='y-M-dd h:mm:ss a'
            /> <br/>
            <label> Deadline:</label>
            <DateTimePicker
                onChange={setDeadline}
                value={new Date(deadline)}
                format='y-M-dd h:mm:ss a'
            /> <br/>
            <button onClick={() => {
                const main = document.getElementById('taskPageStart')
                const newNode = document.createElement('div')
                main.parentNode.insertBefore(newNode, main)

                const description = document.getElementById('DescriptionOfTask' + taskId).value

                const dataStart = new Date(startTime),
                    dataDeadline = new Date(deadline)

                if (dataStart > dataDeadline) {
                    ReactDOM.render(
                        <Alert message='The deadline can`t be before the start' type="warning"
                               closeText="Close Now"/>, newNode,
                    )
                    return
                }

                if(description==='' || description.replaceAll(' ','')===''){
                    ReactDOM.render(
                        <Alert message='The task must have a description' type="error"
                               closeText="Close Now"/>, newNode,
                    )
                    return
                }

                //facem update-ul pe frontend
                setDescription(description)

                //dupa care trimitem request-ul catre backend
                //Motivatia este ca daca asteptam pana primim raspuns interfata se poate simti un pic unresponsive
                //In caz de eroare user-ul primeste mesaj, iar dupa ce da refresh are din nou datele de pe backend
                fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ownerToken: userToken,
                        columns: 'description startTime deadline',
                        description: description,
                        startTime: startTime,
                        deadline: deadline
                    })
                }).then(res => res.json())
                    .then(result => {
                        if (result.message.includes('successfully')) {
                            ReactDOM.render(
                                <Alert message={result.message} type="success" closeText="Close Now"/>, newNode,
                            )
                            setClicked(!clicked)
                        } else {
                            ReactDOM.render(
                                <Alert message={result.message} type="error" closeText="Close Now"/>, newNode,
                            )
                        }

                    })
                console.log(startTime)
            }}>Finish edits
            </button>
            <button onClick={() => {
                const main = document.getElementById('taskPageStart')
                const newNode = document.createElement('div')
                main.parentNode.insertBefore(newNode, main)

                fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ownerToken: userToken
                    })
                }).then(res => res.json())
                    .then(result => {
                        if (result.message.includes('successfully')) {
                            window.location.reload()
                            ReactDOM.render(
                                <Alert message={result.message} type="success" closeText="Close Now"/>, newNode,
                            )
                        } else {
                            ReactDOM.render(
                                <Alert message={result.message} type="error" closeText="Close Now"/>, newNode,
                            )
                        }

                    })
            }}>
                Delete {parentTaskId !== null ? 'subtask' : 'task'}
            </button>
            <button onClick={() => {
                setClicked(!clicked)
            }}>Cancel
            </button>
        </div>
    )


    //fiecare task este alcatuit din doua componente principale: un ecran de vizualizat detaliile despre task-uri + unul de editat acele detalii

    return !clicked ? displayMode : editMode
}


export default Task