import '../stylesheets/task.scss'
import Task from "../components/Task"
import {useEffect, useState} from "react"
import {Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

require('dotenv').config();

const userId = sessionStorage.getItem('userId')

async function fetchTasks(setter) {
    setter('')
    const promisedResults = await (await fetch(`${process.env.REACT_APP_API_URL}/tasks/${userId}`, {
        method: 'GET'
    })).json()
    if (promisedResults.results===[]) {
        setter(<div id='noTasksMessage'>{promisedResults}</div>)
        return
    }

    const taskScreen = promisedResults.results.map(task => {
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

function TaskScreen(props) {
    const [rootTasks, setRootTasks] = useState('')
    const taskPage = (
        <div id='taskPageStart'>
            <Button id='addTaskBtn' type="primary" shape="round" icon={<PlusOutlined/>} size={'large'} onClick={() => {
                //verificam daca avem deja un task existent sau este primul pe care il adaugam in lista
                if (rootTasks.length===0) {
                    setRootTasks([<Task
                        initialState={true}
                        completed={false}
                        failed={false}
                        title={''}
                        description={''}
                    />])
                } else {
                    setRootTasks(Array.from([<Task
                        initialState={true}
                        completed={false}
                        failed={false}
                        title={''}
                        description={''}
                    />, ...rootTasks]))
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