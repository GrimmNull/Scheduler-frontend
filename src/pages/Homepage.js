import 'antd/dist/antd.css';
import {useEffect, useState} from "react";
import { Card } from 'antd';

const userId = sessionStorage.getItem('userId')

async function fetchTasks(setter) {
    setter('')
    const promisedResults = await (await fetch(`${process.env.REACT_APP_API_URL}/tasks/today/${userId}`, {
        method: 'GET'
    })).json()
    if (promisedResults.results===[]) {
        setter(<div id='noTasksMessage'>{promisedResults}</div>)
        return
    }

    const taskScreen = promisedResults.results.map(task => {
        if (task) {
            return <><Card hoverable title={task.description} size='small' style={{width: 350}} headStyle={{color: "gold"}}>
                <p style={{color:"black"}}>Start time: {task.startTime}</p>
                <p style={{color:"black"}}>Deadline: {task.deadline}</p>
            </Card><br/></>
        } else {
            return <br/>
        }
    })
    setter(taskScreen)

}

function Homepage(props) {
    const[tasks,setTasks]= useState(<h3>Fetching your tasks</h3>)
    useEffect(() => {
        fetchTasks(setTasks)
    },[])

    return (<div>
        {tasks}
    </div>)
}

export default Homepage