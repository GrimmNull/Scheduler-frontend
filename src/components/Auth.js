import {useState} from "react";
import {AuthConsumer} from "../contexts/Auth.js";
import triggerAlert from "../triggerAlert";


async function login(usernameField, passwordField) {
    const response = await fetch('http://localhost:8000/users/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById(usernameField).value,
            password: document.getElementById(passwordField).value
        })
    })
    if (response.status !== 200) {
        return {
            type: 'Error',
            message: response.message
        }
    }
    const results = await response.json()
    console.log(results)
    sessionStorage.setItem('userId',results.userId)
    sessionStorage.setItem('username',results.username)
    sessionStorage.setItem('token',results.token)
    sessionStorage.setItem('expiresAt',results.expiresAt)
    return {
        type: 'Success',
        message: 'You have successfully logged in'
    }
}

function Auth(props) {
    const [form, setForm] = useState('login')

    const toggleButtons = (
        <div>
            <button id='loginBtn' onClick={() => {
                setForm('login')
            }}>
                Login
            </button>
            <button id='registerBtn' onClick={() => {
                setForm('register')
            }}>
                Register
            </button>
        </div>
    )

    const loginForm = (
        <AuthConsumer>
            {({state, dispatch}) => (
                <div>
                    <label>Username:</label><br/>
                    <input id='usernameInput' type='text'/><br/>
                    <label>Password:</label><br/>
                    <input id='passwordInput' type='text'/><br/>
                    <button onClick={async () => {
                        console.log(document.getElementById('passwordInput').value)
                        const response = await login('usernameInput', 'passwordInput')
                        console.log(response)
                        if (response.type !== 'Error') {
                            dispatch({type: 'connect'})
                            triggerAlert(response.message)
                        } else {
                            triggerAlert(response.message)
                        }
                    }}>Login
                    </button>
                </div>
            )}
        </AuthConsumer>

    )

    const registerForm = (
        <div>
            <label>Username:</label><br/>
            <input id='usernameRegister' type='text'/><br/>
            <label>Email:</label><br/>
            <input id='emailRegister' type='text'/><br/>
            <label>Password:</label><br/>
            <input id='passwordRegister' type='text'/><br/>
            <label>Confirm password:</label><br/>
            <input id='passwordConfirm' type='text'/><br/>
            <button onClick={async () => {
                const pass = document.getElementById('passwordRegister').value
                const confirmPass = document.getElementById('passwordConfirm').value

                if (pass !== confirmPass) {
                    triggerAlert('The passwords don`t match')
                    return
                }

                const response = await fetch('http://localhost:8000/users', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username: document.getElementById('usernameRegister').value,
                        email: document.getElementById('emailRegister').value,
                        password: document.getElementById('passwordRegister').value
                    })
                })
                console.log(response)
                if (response.status === 200) {
                    triggerAlert('Account successfully created')
                } else {
                    triggerAlert(response.message)
                }
            }}>Register
            </button>
        </div>
    )

    return (
        <AuthConsumer>
            {({state, dispatch}) => (
                <div>
                    {toggleButtons}
                    {form === 'login' ? loginForm : registerForm}
                </div>
            )}

        </AuthConsumer>
    )


}

export default Auth