import {useEffect, useState} from "react";
import {Calendar, Badge} from 'antd';
import moment from 'moment'

function DateCellRender(value) {
    const [listData, setListData] = useState([])
    const [dateCell, setDateCell] = useState(<></>)
    const [userId, setUserId] = useState(null)
    const [date, setDate] = useState(value)

    const getListData = async (value) => {
        let stats = await (await fetch(`${process.env.REACT_APP_API_URL}/users/stats/${userId}?date=${moment(value).toISOString().split('T')[0]}`, {
            method: 'GET'
        })).json()
        //{ type: 'warning', content: 'This is warning event.' }
        //        { type: 'success', content: 'This is very long usual event。。....' },
        //         { type: 'error', content: 'This is error event 1.' },
        if(Object.keys(stats).every(column => stats[column]==null)){
            return []
        }
        const listData= [
            { type: 'success', content: `Completed: ${stats.completed}` },
            { type: 'warning', content: `Pending: ${stats.pending}` },
            { type: 'error', content: `Failed: ${stats.failed}` },
            { type: 'warning', content: `Tasks: ${stats.tasks}` },
            { type: 'warning', content: `Pending: ${stats.subtasks}` }
        ]
        return listData || [];
    }

    useEffect(() => {
        getListData(value).then(res => setListData(res))
        setUserId(localStorage.getItem('userId'))
    },[value])

    return (
        <ul className="events">
            {listData.map(item => (
                <li key={item.content}>
                    <Badge status={item.type} text={item.content}/>
                </li>
            ))}
        </ul>
    );

}

export default DateCellRender;