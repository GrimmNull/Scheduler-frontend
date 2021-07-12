import {useState} from "react";
import {AuthConsumer} from "../contexts/Auth.js";
import {Alert, Radio} from 'antd';
import * as ReactDOM from "react-dom";
import {useHistory} from 'react-router-dom'
import '../stylesheets/auth.scss'
require('dotenv').config();

//am extras functia care face apelul catre backend pentru verificarea datelor ca sa putem loga userul imediat cum isi face cont
async function login(usernameField, passwordField) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById(usernameField).value,
            password: document.getElementById(passwordField).value
        })
    })
    const status= response.status
    const results = await response.json()
    if (status !== 200) {
        return {
            type: 'Error',
            message: results.message
        }
    }
    //daca nu avem nicio eroare, atunci salvam in sessionStorage informatiile despre user
    sessionStorage.setItem('userId', results.userId)
    sessionStorage.setItem('username', results.username)
    sessionStorage.setItem('email', results.email)
    sessionStorage.setItem('token', results.token)
    sessionStorage.setItem('expiresAt', results.expiresAt)
    return {
        type: 'Success',
        message: 'You have successfully logged in'
    }
}

function Auth(props) {
    const [form, setForm] = useState('login')
    const history = useHistory()

    //componenta din antd ca sa comutam intre ecranul de logare si cel de inregistrare
    const toggles = (
        <Radio.Group id='selector' defaultValue="a" buttonStyle="solid">
            <Radio.Button onClick={() => {
                setForm('login')
            }} value="a">Login</Radio.Button>
            <Radio.Button onClick={() => {
                setForm('register')
            }} value="b">Register</Radio.Button>

        </Radio.Group>
    )

    //folosim aici contextul de autentificare ca sa spunem si restul componentelor (in principal doar navbar-ului) daca un user a reusit sa se logheze sau nu
    const loginForm = (
        <AuthConsumer>
            {({state, dispatch}) => (
                <div id='loginForm'>
                    <label>Username:</label><br/>
                    <input id='usernameInput' type='text'/><br/>
                    <label>Password:</label><br/>
                    <input id='passwordInput' type='password'/><br/>
                    <button onClick={async () => {
                        //chemam functia de login si verificam datele utilizatorului
                        const response = await login('usernameInput', 'passwordInput')

                        //ne pregatim din nou un loc unde sa inseram mesajul
                        const main = document.getElementById('authMenu')
                        const newNode = document.createElement('div')
                        main.parentNode.insertBefore(newNode, main)

                        if (response.type !== 'Error') {
                            //daca totul e bine, updatam contextul deoarece avem un user logat
                            dispatch({type: 'connect'})
                            ReactDOM.render(
                                <Alert message={response.message} type="success" closeText='Close now'/>,
                                newNode,
                            );
                            //redirectionam user-ul catre homepage ca sa nu ramana pe ecranul de logare/inregistrare
                            history.push('/Homepage')
                            sessionStorage.setItem('currentPage', 1)
                            window.location.reload()
                        } else {
                            console.log(response)
                            ReactDOM.render(
                                <Alert message={response.message} type="error" closeText='Close now'/>,
                                newNode,
                            );
                        }
                    }}>Login
                    </button>
                </div>
            )}
        </AuthConsumer>

    )

    //form-ul de inregistrare merge in principal cam la fel cu cel de login, doar ca mai avem etapa in care adaugam un nou cont la baza de date
    const registerForm = (
        <AuthConsumer>
            {({state, dispatch}) => (
                <div id='registerForm'>
                    <label>Username:</label><br/>
                    <input id='usernameRegister' type='text'/><br/>
                    <label>Email:</label><br/>
                    <input id='emailRegister' type='text'/><br/>
                    <label>Password:</label><br/>
                    <input id='passwordRegister' type='password'/><br/>
                    <label>Confirm password:</label><br/>
                    <input id='passwordConfirm' type='password'/><br/>
                    <button onClick={async () => {
                        const main = document.getElementById('authMenu')
                        const newNode = document.createElement('div')
                        main.parentNode.insertBefore(newNode, main)

                        //ne asiguram mai intai ca cele doua parole coincid
                        const pass = document.getElementById('passwordRegister').value
                        const confirmPass = document.getElementById('passwordConfirm').value
                        if (pass !== confirmPass) {
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
                                username: document.getElementById('usernameRegister').value,
                                email: document.getElementById('emailRegister').value,
                                password: document.getElementById('passwordRegister').value
                            })
                        })
                        //daca a fost creat contul, continuam cu partea de logare a user-ului
                        if (response.status === 200) {
                            ReactDOM.render(
                                <Alert message='Account successfully created' type="success"
                                       closeText="Close Now"/>, newNode,
                            )
                            const response = await login('usernameRegister', 'passwordRegister')
                            if (response.type !== 'Error') {
                                dispatch({type: 'connect'})
                                window.location.reload()
                                ReactDOM.render(
                                    <Alert message={response.message} type="success" closeText='Close now'/>,
                                    newNode,
                                );
                                history.push('/Homepage')
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
                    }}>Register
                    </button>
                </div>
            )}
        </AuthConsumer>

    )

    return (
        <div id='authMenu'>
            {toggles}
            {form === 'login' ? loginForm : registerForm}
        </div>

    )

}

export default Auth