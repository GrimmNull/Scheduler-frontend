import { Modal, Button, Tooltip } from 'antd';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {useFetch} from "../contexts/Refetch.js";
import {useEffect, useReducer} from "react";
import {initialState, deleteTaskReducer} from "../reducers/DeleteTaskReducer";
require('dotenv').config();

export const DeleteTask= (props) => {
    const refetch=useFetch(state => state.reload)
    const userToken=localStorage.getItem('token')
    const [state,dispatch] = useReducer(deleteTaskReducer,initialState)
    const deleteIt= () => {
        fetch(`${process.env.REACT_APP_API_URL}/tasks/${props.taskId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ownerToken: userToken
            })
        }).then(() => dispatch({type: 'deleted'}))
    }

    const confirm = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure that you want to delete this ${props.type}?`,
            okText: 'Delete',
            onOk:deleteIt,
            cancelText: 'Cancel',
        })
    }

    useEffect(() => {
        if(state.deleted){
            refetch()
        }
    } ,[state.deleted])

    return <Tooltip title="Delete">
        <Button onClick={() => confirm()} shape="circle" icon={<CloseOutlined />} />
    </Tooltip>

}