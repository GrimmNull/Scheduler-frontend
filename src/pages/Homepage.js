import 'antd/dist/antd.css'
import '../stylesheets/Homepage.scss'
import {useEffect, useReducer} from 'react'
import { Calendar, Badge } from 'antd'
import moment from 'moment'
import {initialState,homepageReducer} from '../reducers/HomepageReducer.js'

const userId = localStorage.getItem('userId')

async function fetchTasks (setter) {
    setter('')
    const promisedResults = await (await fetch(`${process.env.REACT_APP_API_URL}/tasks/today/${userId}`, {
        method: 'GET'
    })).json()
    if (promisedResults.results === []) {
        setter('')
        return
    }

    setter(promisedResults)

}


function Homepage (props) {
    const [state,dispatch] = useReducer(homepageReducer,initialState)
    const fetchData = async () => {
        const userId = localStorage.getItem('userId')
        let date = moment(state.month).toISOString().split('T')[0]
        let url = `${process.env.REACT_APP_API_URL}/users/stats/${userId}?date=${date}`
        return await (await fetch(url, {
            method: 'GET'
        })).json()
    }

    useEffect(() => {
        (async function () {
            let data = await fetchData()
            dispatch({type: 'stats', payload: data})
        })()
    }, [])

    useEffect(() => {
        (async function () {
            let data = await fetchData()
            dispatch({type: 'stats', payload: data})
        })()
    }, [state.month])

    function getListData (value) {
        const date = value.format('YYYY-MM-DD')
        let listData = []
        state.stats.map(v => {
            if (v.day === date) {
                listData = [
                    { type: 'success', content: `Completed: ${v.completed}` },
                    { type: 'warning', content: `Pending: ${v.active}` },
                    { type: 'error', content: `Failed: ${v.failed}` },
                ]
            }
        })
        return listData
    }

    function dateCellRender (value) {
        const listData = getListData(value)
        return (
            <ul className="events">
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content}/>
                    </li>
                ))}
            </ul>
        )
    }

    function getMonthData (value) {
        if (value.month() === 8) {
            return 1394
        }
    }

    function monthCellRender (value) {
        const num = getMonthData(value)
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null
    }

    const onChange = (e) => {
        let date = e.format('YYYY-MM-DD')
        if (e.format('YYYY-MM') !== moment(state.month).format('YYYY-MM')) {
            dispatch({type: 'month', payload: date})
        }
    }

    return <div className="homepageScreen">
        {state.stats.length > 0 && (
            <Calendar
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
                onChange={onChange}
            />)}
    </div>
}

export default Homepage