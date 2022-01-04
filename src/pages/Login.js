import {AuthConsumer, useAuth} from "../contexts/Auth.js";
import {Alert, Radio, Card, Form, Input, Button} from 'antd';
import * as ReactDOM from "react-dom";
import {useHistory} from 'react-router-dom'
import {login} from '../utils/login.js'
import '../stylesheets/auth.scss'


require('dotenv').config();


const onFinishLogin = async (values, dispatch, history) => {
    const response = await login(values.username, values.password)

    //ne pregatim din nou un loc unde sa inseram mesajul
    const main = document.getElementById('authMenu')
    const newNode = document.createElement('div')
    main.parentNode.insertBefore(newNode, main)

    if (response.type !== 'Error') {
        //daca totul e bine, updatam contextul deoarece avem un user logat
        dispatch(true)
        ReactDOM.render(
            <Alert message={response.message} type="success" closeText='Close now'/>,
            newNode,
        );
        //redirectionam user-ul catre homepage ca sa nu ramana pe ecranul de logare/inregistrare
        history.push('/homepage')
        sessionStorage.setItem('currentPage', 1)
        window.location.reload()
    } else {
        ReactDOM.render(
            <Alert message={response.message} type="error" closeText='Close now'/>,
            newNode,
        );
    }
}

function Auth(props) {
    const history = useHistory()
    const auth = useAuth(state => state.setAuth)
    //componenta din antd ca sa comutam intre ecranul de logare si cel de inregistrare
    const toggles = (
        <Radio.Group id='selector' defaultValue="a" buttonStyle="solid">
            <Radio.Button onClick={() => {

            }} value="a">Login</Radio.Button>
            <Radio.Button onClick={() => {
                history.push('./register')
            }} value="b">Register</Radio.Button>

        </Radio.Group>
    )

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
                onFinish={(values) => {
                    onFinishLogin(values, auth, history)
                }}
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
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>

    )

}

export default Auth