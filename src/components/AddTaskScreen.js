import {useReducer} from "react";
import {Modal, Button, Tooltip} from 'antd';
import 'antd/dist/antd.css';
import {AddTaskForm} from "./AddTaskForm";
import {initialState,taskAddReducer} from "../reducers/TaskAddReducer";
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

export const AddTaskScreen = (props) => {
    const [state,dispatch] = useReducer(taskAddReducer, initialState)
    const styleToAdd = {
        width: 60,
        height: 60,
        margin: 10
    }

    const showModal = () => {
        dispatch({type:'visible'})
    };

    const handleOk = () => {
        dispatch({type:'unloaded'})
        setTimeout(() => {
            dispatch({type:'loaded'})
            dispatch({type:'hidden'})
        }, 3000);
    };

    const handleCancel = () => {
        dispatch({type:'hidden'})
    };
    return (
        <>
            {props.root ? <Tooltip title="Add new task">
                <Button type="primary" style={styleToAdd} onClick={() => showModal()} shape="circle"
                        icon={<PlusOutlined/>}/>
            </Tooltip> : props.mode === 'edit' ? <EditOutlined onClick={() => showModal()} key="edit"/> :
                <PlusOutlined onClick={() => showModal()} key="setting"/>}


            <Modal
                visible={state.visible}
                title={props.mode === 'edit' ? 'Edit a ' + (props.parentTaskId ? 'subtask' : 'task') : "Add a new " + (props.parentTaskId ? 'subtask' : 'task')}
                onOk={() => handleOk}
                onCancel={() => handleCancel()}
                footer={null}
            >
                <AddTaskForm
                    parentTaskId={props.taskId}
                    taskId={props.taskId}
                    mode={props.mode}
                />
            </Modal>
        </>
    );
}