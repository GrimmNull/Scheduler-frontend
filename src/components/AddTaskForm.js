import 'antd/dist/antd.css';
import {Form, Input, DatePicker, Button, Select} from 'antd';
import {createRef, useEffect, useRef, useReducer} from "react";
import moment from 'moment'
import {useFetch} from "../contexts/Refetch.js";
import {initialState,taskFormReducer} from "../reducers/TaskFormReducer";
import {useCategories} from "../contexts/Categories";

const { Option } = Select;

require('dotenv').config();

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export const AddTaskForm = (props) => {
    const formRef = createRef();
    const description = useRef('')
    const startTime = useRef(moment())
    const deadline = useRef(moment())
    const categories= useRef([])
    const refetchTasks= useFetch(state => state.reload)
    const categoriesList= useCategories(state => state.categories)
    const userId=localStorage.getItem('userId')
    const userToken=localStorage.getItem('token')
    const [state,dispatch] = useReducer(taskFormReducer,{...initialState, loading: props.mode === 'edit'})
    const onFinish = (values) => {
        const categoriesActions=categoriesList.filter(category => !values.categories.includes(category.id)).map(category => {
            return {
                type: 'remove',
                categoryId: category.id
            }
        }).concat(values.categories.map(category => {
            return {
                type: 'add',
                categoryId: category
            }
        }))
        let requestBody={
            columns: 'description startTime deadline',
            ownerToken: userToken,
            parentTaskId: props.parentTaskId,
            userId: userId,
            description: values.description,
            startTime: moment(values.startTime).toISOString(),
            deadline: moment(values.deadline).toISOString()
        }

        const editString=props.mode==='edit'? `/${props.taskId}` : ''

        fetch(`${process.env.REACT_APP_API_URL}/tasks${editString}`, {
            method: props.mode==='edit'? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        }).then(res => res.json()).then(response => {
            const taskId=props.mode==='edit'? props.taskId : response.taskId
            fetch(`${process.env.REACT_APP_API_URL}/tasks/categories/${taskId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ownerToken: userToken,
                    actions: categoriesActions
                })
            }).then(res => res.json()).then(response => {
                dispatch({type: 'result', payload: response.message})
                dispatch({type: 'finished'})

            })})
    };

    const onReset = () => {
        formRef.current.resetFields();
    };

    useEffect(() => {
            if (state.finished) {
                refetchTasks()
            }
        }
    , [state.finished])

    useEffect(() => {
        if (props.mode !== 'edit' || !props.taskId) {
            return
        }
        fetch(`${process.env.REACT_APP_API_URL}/tasks/${props.taskId}`, {
            method: 'GET'
        }).then(res => res.json()).then(infos => {
            description.current = infos.description
            startTime.current = infos.startTime
            deadline.current = infos.deadline
            categories.current= infos.categories
            dispatch({type: 'loaded'})
        })
    }, [])


    return state.finished? state.resultedMessage : (state.loading? '<h1>Fetching infos now</h1>' : (
        <Form {...layout} ref={formRef} name="control-ref" initialValues={{
            description: description.current,
            startTime: moment(startTime.current),
            deadline: moment(deadline.current),
            categories: categories.current.map(category => category.id)
        }} onFinish={() => onFinish(formRef.current.getFieldsValue())}>
            <Form.Item
                name="description"
                label="Description"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item name="startTime" label="Start time: " rules={[{
                required: true,
            }]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
            </Form.Item>
            <Form.Item name="deadline" label="Deadline: " rules={[{
                required: true,
            }]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
            </Form.Item>
            <Form.Item name='categories' label='Categories'>
                <Select mode="multiple" placeholder="Please select favourite colors">
                    {categoriesList.map(category => (
                        <Option
                            value={category.id}
                        >
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={() => onReset()}>
                    Reset
                </Button>
            </Form.Item>
        </Form>
    ))
}

