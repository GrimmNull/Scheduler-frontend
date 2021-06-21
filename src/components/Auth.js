import {useContext, useState} from "react";
import {AuthProvider, AuthConsumer, useAuth} from "../contexts/Auth.js";


function Auth(props) {
    const [logged, setLogged] = useState(false)
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
                        const response = await fetch('http://localhost:8000/users/auth/login', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username: document.getElementById('usernameInput').value,
                                password: document.getElementById('passwordInput').value
                            })
                        })
                        console.log(response)
                        if (response.status === 200) {
                            dispatch({type: 'connect'})
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
                    console.log('The passwords don`t match')
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
                    console.log('Account successfully created')
                } else {
                    console.log(response.message)
                }
            }}>Register
            </button>
        </div>
    )

    return (
            <AuthConsumer>
                {({state, dispatch}) => (
                    <div>
                        {console.log(state)}
                        {toggleButtons}
                        {form === 'login' ? loginForm : registerForm}
                        {state.auth ? <h1>You are logged</h1> : <h1>You are not logged</h1>}
                    </div>
                )}

            </AuthConsumer>
    )


}

export default Auth