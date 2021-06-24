import '../stylesheets/task.scss'
import Task from "../components/Task"
import {useEffect, useState} from "react"
import { Button} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const userId=sessionStorage.getItem('userId')


//luam prima data doar task-urile principale
async function fetchRootTasks() {
    const rootTasks = await (await fetch(`http://localhost:8000/users/tasks/${userId}?rootOnly=true`, {
        method: 'GET'
    })).json()
    return rootTasks.results
}


//apoi le luam si subtask-urile
async function fetchSubTasks(id) {
    const subtasks = await (await fetch(`http://localhost:8000/tasks/subtasks/${id}`, {
        method: 'GET'
    })).json()
    return subtasks.results
}


//iar la final le unim intr-o singura lista
async function addSubTasks() {
    const results = await fetchRootTasks()
    if(!results){
        return 'You have no tasks at this moment'
    }
    let lista = results.map(async task => {
        const subtasks = await fetchSubTasks(task.taskId)
        return [].concat(task, subtasks)
    })
    return lista

}

//Cele 3 functii normal puteau fi facute pe backend, dar imi doream la un moment dat sa iau separat task-urile si dupa sa pun subtask-urile intr-un div,
//doar ca momentan nu prea am gasit o solutie pentru a face asta

async function fetchTasks(setter) {
    setter('')
    const promisedResults = await addSubTasks()
    if(typeof promisedResults === "string"){
        setter(<div id='noTasksMessage'>{promisedResults}</div>)
        return
    }
    //iar aici daca user-ul are macar un task in lista, facem un vector de obiecte de tip Task
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
                        completed={task.completed}
                        failed={task.failed}
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
        <div id='taskPageStart'>
            <Button id='addTaskBtn' type="primary" shape="round" icon={<PlusOutlined />} size={'large'} onClick={() => {
                //verificam daca avem deja un task existent sau este primul pe care il adaugam in lista
                if(!Array.isArray(rootTasks)){
                    setRootTasks([<Task
                        initialState={true}
                        title={''}
                        description={''}
                    />])
                } else {
                    setRootTasks([<Task
                        initialState={true}
                        title={''}
                        description={''}
                    /> , ...rootTasks])
                }
            }}>
                Add task
            </Button>

            {rootTasks}
        </div>
    )
    useEffect(() => {
        fetchTasks((setRootTasks))
    }, [])
    //din fericire, fetch-ul este suficient de rapid incat nu prea se vede partea de fetching
    return rootTasks === '' ? (<h1>Fetching your tasks right now...</h1>) : (taskPage)
}

export default TaskScreen