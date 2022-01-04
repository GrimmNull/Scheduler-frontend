import '../stylesheets/task.scss'
import {useEffect, useReducer} from "react"
import {AddTaskScreen} from "../components/AddTaskScreen";
import {useFetch} from "../contexts/Refetch.js";
import {Space, Spin} from 'antd'
import {initialState, tasksReducer} from '../reducers/FetchReducer.js'
import Task from "../components/Task";
import {useCategories} from "../contexts/Categories.js";


require('dotenv').config();
const userId = localStorage.getItem('userId')


const getTasks = async (dispatch) => {
    dispatch({type: 'hide'})
    const tasks = await (await fetch(`${process.env.REACT_APP_API_URL}/tasks/user/${userId}`, {
        method: 'GET'
    })).json()
    dispatch({type: 'load', payload: tasks.results})
}

const getCategories = async (dispatch) => {
    const categories = await (await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
        method: 'GET'
    })).json()
    dispatch({type:'categories', payload:categories.results})
}

const convertToJSX = (tasks) => {
    if (tasks === '') {
        return <h1>You have no tasks at this moment</h1>
    }
    return tasks.map(task => {
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
                categories={task.categories}
            />
        } else {
            return <br/>
        }
    })
}

function TaskScreen(props) {
    const [state, dispatch] = useReducer(tasksReducer, initialState)
    const refetch = useFetch(state => state.refetch)
    const setCategories= useCategories(state => state.setCategories)
    useEffect(() => {
        //setTimeout-ul este pentru a putea vizualiza spinner-ul
        setTimeout(() => {
            getTasks(dispatch)
        }, 1500)
    }, [refetch])

    useEffect(() => {
        getCategories(dispatch)
    } ,[])

    useEffect(() => {
        setCategories(state.categoriesTemp)
    }, [state.categoriesTemp])

    return (
        <div id='taskPageStart' className='appPage'>
            <Space direction='vertical' size={20}>
                <AddTaskScreen
                    root={true}
                    mode='add'
                />
                <Space direction='vertical' size={40}>
                    {state.loading ? (
                        <Spin className='center biggerText' tip="Loading tasks..."/>) : convertToJSX(state.tasks)}

                </Space>
            </Space>
        </div>
    )
}

export default TaskScreen