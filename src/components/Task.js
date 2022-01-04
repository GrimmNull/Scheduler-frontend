import {useEffect, useReducer} from "react"
import '../stylesheets/task.scss'
import {AddTaskScreen} from "./AddTaskScreen";
import {Card, Alert, List} from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import {DeleteTask} from "./DeleteTask";
import {useFetch} from "../contexts/Refetch";
import {initialState, taskReducer} from "../reducers/TaskReducer.js";
import * as ReactDOM from 'react-dom'
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";

let dateFormat = require('dateformat');
require('dotenv').config();

const userToken = localStorage.getItem('token')


const Task = (props) => {
    const [state, dispatch] = useReducer(taskReducer, initialState)
    useEffect(() => {
        dispatch({
            type: 'set', payload: {
                parentTaskId: props.parentTaskId,
                description: props.description,
                startTime: props.startTime ? props.startTime : new Date(),
                deadline: props.deadline ? props.deadline : new Date(),
                completed: props.completed,
                failed: props.failed,
                categories: props.categories
            }
        })
        if (props.taskId) {
            //daca am primit deja unul din props atunci ne oprim aici
            dispatch({type: 'set', payload: {taskId: props.taskId}})
        } else {
            //daca nu, atunci facem un request ca sa fie creat un task al carui id ne va fi returnat
            fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ownerToken: userToken,
                    type: 'temp',
                    parentTaskId: state.parentTaskId
                })
            }).then(res => res.json())
                .then(result => {
                    //daca merge totul bine, atunci ii punem task-ului id-ul pe care l-am primit de la server
                    dispatch({type: 'set', payload: {taskId: result.taskId}})
                })
        }
    }, [props])

    const refetchTasks = useFetch(state => state.reload)
    const styleToApply = {width: 300}
    styleToApply['borderTopLeftRadius'] = 10
    styleToApply['borderTopRightRadius'] = 10
    styleToApply['marginLeft'] = 15

    styleToApply['borderTop'] = `4px solid ` + (state.completed ? '#00ff00' : state.failed ? '#ff0000' : '#ffdf00')

    if (state.parentTaskId) {
        styleToApply['marginLeft'] = 60
    }


    return (
        <Card title={state.description} extra={<DeleteTask
            type={state.parentTaskId ? 'subtask' : 'task'}
            taskId={state.taskId}/>} style={styleToApply} actions={[
            <AddTaskScreen
                buttonName={'Add subtask'}
                parentTaskId={state.parentTaskId}
                taskId={state.taskId}
                mode='add'
            />,
            //,
            <AddTaskScreen
                buttonName={'Edit ' + (state.parentTaskId !== null ? 'subtask' : 'task')}
                mode='edit'
                parentTaskId={state.parentTaskId}
                taskId={state.taskId}
            />,
            <CheckOutlined onClick={() => {
                const main = document.getElementById('taskPageStart')
                const newNode = document.createElement('div')
                main.parentNode.insertBefore(newNode, main)

                const status = !state.completed
                dispatch({type: 'set', payload: {completed: status}})
                fetch(`${process.env.REACT_APP_API_URL}/tasks/completed/${state.taskId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ownerToken: localStorage.getItem('token'),
                        completed: status,
                        root: state.parentTaskId === null
                    })
                }).then(res => res.json())
                    .then(result => {
                        if (result.message.includes('successfully')) {
                            refetchTasks()
                            ReactDOM.render(
                                <Alert message={result.message} type="success" closeText="Close Now"/>, newNode,
                            )
                        } else {
                            ReactDOM.render(
                                <Alert message={result.message} type="error" closeText="Close Now"/>, newNode,
                            )
                        }

                    })

            }} key="ellipsis"/>,
        ]}>
            <p>Start time: {dateFormat(state.startTime, 'dd/m/yyyy, h:MM:ss TT')}</p>
            <p>Deadline: {dateFormat(state.deadline, 'dd/m/yyyy, h:MM:ss TT')} </p>
            {state.categories.length === 0 ? '' : <List
                grid={{
                    gutter: 40,
                }}
                dataSource={state.categories}
                renderItem={item => (
                    <List.Item>
                        <p className='categoryItem'>{item.name}</p>
                    </List.Item>
                )}
            />

            }
        </Card>
    )
}


export default Task