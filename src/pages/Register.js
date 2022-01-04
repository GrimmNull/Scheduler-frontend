import {useAuth} from "../contexts/Auth.js";
import {Alert, Radio, Card, Form, Input, Button} from 'antd';
import * as ReactDOM from "react-dom";
import {useHistory} from 'react-router-dom'
import {login} from '../utils/login.js'
import '../stylesheets/auth.scss'


require('dotenv').config();

const onFinishRegister = async (values, dispatch, history) => {
    const main = document.getElementById('authMenu')
    const newNode = document.createElement('div')
    main.parentNode.insertBefore(newNode, main)

    //ne asiguram mai intai ca cele doua parole coincid
    if (values.password !== values.passwordConfirm) {
        ReactDOM.render(
            <Alert message='The passwords don`t match' type="error"
                   closeText="Close Now"/>, newNode,
        )
        return
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password
        })
    })
    //daca a fost creat contul, continuam cu partea de logare a user-ului
    if (response.status === 200) {
        ReactDOM.render(
            <Alert message='Account successfully created' type="success"
                   closeText="Close Now"/>, newNode,
        )
        const response = await login(values.username, values.password)
        if (response.type !== 'Error') {
            dispatch(true)
            window.location.reload()
            ReactDOM.render(
                <Alert message={response.message} type="success" closeText='Close now'/>,
                newNode,
            );
            history.push('/homepage')
            sessionStorage.setItem('currentPage', 1)
            window.location.reload()
        } else {
            ReactDOM.render(
                <Alert message={response.message} type="error" closeText='Close now'/>,
                newNode,
            );
        }
    } else {
        //daca n-a functionat crearea contului, atunci informam user-ul si motivul pentru care nu s-a reusit
        ReactDOM.render(
            <Alert message={response.message} type="error" closeText='Close now'/>,
            newNode
        )
    }
}

function Auth(props) {
    const history = useHistory()
    const auth = useAuth(state => state.setAuth)
    //componenta din antd ca sa comutam intre ecranul de logare si cel de inregistrare
    const toggles = (
        <Radio.Group id='selector' defaultValue="b" buttonStyle="solid">
            <Radio.Button onClick={() => {
                history.push('./login')
            }} value="a">Login</Radio.Button>
            <Radio.Button onClick={() => {
            }} value="b">Register</Radio.Button>

        </Radio.Group>
    )

    //form-ul de inregistrare merge in principal cam la fel cu cel de login, doar ca mai avem etapa in care adaugam un nou cont la baza de date

    return (
        <Card id='authMenu' className='authMenu centered halfWidth'>
            {toggles}
            <Form
                className='authForm'
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={(values) => onFinishRegister(values, auth, history)}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="Confirm pass"
                    name="passwordConfirm"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>

    )

}

export default Auth