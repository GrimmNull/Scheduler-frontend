import * as ReactDOM from "react-dom";
import {useHistory} from 'react-router-dom'
import {Alert, Card, Form, Input, Button} from "antd";
import '../stylesheets/Profile.scss'
import {useReducer} from "react";
import {useAuth} from "../contexts/Auth.js";
import {initialState,profileReducer} from "../reducers/ProfileReducer.js";

require('dotenv').config();

const onFinishEdit = async (values, setScreen, infoToChange) => {
    const main = document.getElementById('profilePageStart')
    const newNode = document.createElement('div')
    main.parentNode.insertBefore(newNode, main)
    if (infoToChange === 'password') {
        const pass = values.password,
            confPass = values.passwordConfirm
        if (pass !== confPass) {
            ReactDOM.render(
                <Alert message='Passwords don`t match' type="error" closeText='Close now'/>,
                newNode,
            );
            return
        }
    }
    const data = infoToChange === 'password' ? {
            ownerToken: localStorage.getItem('token'),
            password: values.password
        }
        :
        infoToChange === 'username' ? {
                ownerToken: localStorage.getItem('token'),
                username: values.username
            }
            :
            {
                ownerToken: localStorage.getItem('token'),
                email: values.email
            }
    fetch(`${process.env.REACT_APP_API_URL}/users/${localStorage.getItem('userId')}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(result => {
            if (result.message.includes('successfully')) {
                ReactDOM.render(
                    <Alert message={result.message} type="success" closeText='Close now'/>,
                    newNode,
                );
                if (infoToChange === 'email') {
                    localStorage.setItem('email', values.email)
                } else if(infoToChange === 'username'){
                    localStorage.setItem('username', values.username)
                }
                window.location.reload()
            } else {
                ReactDOM.render(
                    <Alert message={result.message} type="error" closeText='Close now'/>,
                    newNode,
                );
                setScreen({type: 'profile'})
            }

        })
}


//Si la profil teoretic avem doar doua ecrane, unul pe care prezentam informatiile referitoare la cont, si inca unul pe care le poate edita
function Profile(props) {
    const [state, dispatch] = useReducer(profileReducer,initialState)
    const auth= useAuth(state => state.setAuth)
    const history = useHistory()
    const information = (
        <div id='infos'>
            <h2 onClick={() => {
                dispatch({type: 'username'})
            }}>Username: {localStorage.getItem('username')}</h2>
            <h2 onClick={() => {
                dispatch({type: 'email'})
            }}>Email: {localStorage.getItem('email')}</h2>
        </div>
    )

    const logoutBtn = (
                <Button id='logoutBtn' onClick={() => {
                    //cand un user se deconecteaza, ii scoatem toate datele referitoare la cont, ii trimitem o notificare si-l redirectionam catre pagina de start
                    localStorage.removeItem('username')
                    localStorage.removeItem('email')
                    localStorage.removeItem('userId')
                    localStorage.removeItem('token')
                    localStorage.removeItem('expiresAt')
                    localStorage.removeItem('auth')
                    const main = document.getElementById('profilePageStart')
                    const newNode = document.createElement('div')
                    main.parentNode.insertBefore(newNode, main)
                    ReactDOM.render(
                        <Alert message="You have successfully logged out" type="success" closeText='Close now'/>,
                        newNode,
                    );
                    auth(false)
                    history.push('/login')
                    sessionStorage.setItem('currentPage', 3)
                    window.location.reload()
                }}>
                    Logout
                </Button>
    )

    const changePassBtn = <Button id='changePassBtn' onClick={() => {
        dispatch({type: 'password'})
    }}>
        Change your password
    </Button>

    const profileScreen = (
        <Card className='profileCard'>
            {information}
            <br/>
            {changePassBtn}
            <br/>
            {logoutBtn}
        </Card>
    )

    const editScreen = (
        <Card className='profileCard editCard'>
            <Form
                className='editForm'
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                onFinish={(values) => {
                    onFinishEdit(values, dispatch, state.infoToChange)
                }}
            >
                {state.infoToChange !== 'password' ?
                    <>
                        <Form.Item
                            label={'New ' + state.infoToChange}
                            name={state.infoToChange}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input the new ${state.infoToChange}!`,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </>
                    :
                    <>
                        <Form.Item
                        label='New password'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
                            },
                        ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                        label='Confirm pass'
                        name='passwordConfirm'
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                        ]}
                        >
                            <Input.Password/>
                        </Form.Item>


                    </>
                }

                <Button type='primary' htmlType='submit'>
                    Submit changes
                </Button>

                <Button id='cancelEditBtn' onClick={() => {
                    dispatch({type: 'return'})
                }}>Cancel
                </Button>
            </Form>
        </Card>
    )

    return (
        <>
            <br id='profilePageStart'/>
            {state.screen === 'profile' ? profileScreen : editScreen}
        </>

    )
}

export default Profile