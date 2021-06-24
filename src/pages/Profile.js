import * as ReactDOM from "react-dom";
import {useHistory} from 'react-router-dom'
import {Alert} from "antd";
import '../stylesheets/Profile.scss'
import {useState} from "react";
import {AuthConsumer} from "../contexts/Auth";

//Si la profil teoretic avem doar doua ecrane, unul pe care prezentam informatiile referitoare la cont, si inca unul pe care le poate edita
function Profile(props) {
    const [screen, setScreen] = useState('profile')
    const [infoToChange, setInfoToChange] = useState('username') //folosim o stare ca sa stim ce informatie sa editam
    const history = useHistory()
    const information = (
        <div id='infos'>
            <h2 onClick={() => {
                setInfoToChange('username')
                setScreen('editPage')
            }}>Username: {sessionStorage.getItem('username')}</h2>
            <h2 onClick={() => {
                setInfoToChange('email')
                setScreen('editPage')
            }}>Email: {sessionStorage.getItem('email')}</h2>
        </div>
    )

    const logoutBtn = (
        <AuthConsumer>
            {({state, dispatch}) => (
                <button id='logoutBtn' onClick={() => {
                    //cand un user se deconecteaza, ii scoatem toate datele referitoare la cont, ii trimitem o notificare si-l redirectionam catre pagina de start
                    sessionStorage.removeItem('username')
                    sessionStorage.removeItem('email')
                    sessionStorage.removeItem('userId')
                    sessionStorage.removeItem('token')
                    sessionStorage.removeItem('expiresAt')
                    sessionStorage.removeItem('auth')
                    const main = document.getElementById('profileScreen')
                    const newNode = document.createElement('div')
                    main.parentNode.insertBefore(newNode, main)
                    ReactDOM.render(
                        <Alert message="You have successfully logged out" type="success" closeText='Close now'/>,
                        newNode,
                    );
                    dispatch({type: 'disconnect'})
                    history.push('/Homepage')
                    sessionStorage.setItem('currentPage', 1)
                    window.location.reload()
                }}>
                    Logout
                </button>
            )}
        </AuthConsumer>
    )

    const changePassBtn = <button id='changePassBtn' onClick={() => {
        setInfoToChange('password')
        setScreen('changeInfo')
    }}>
        Change your password
    </button>

    const profileScreen = (
        <div id='profileScreen'>
            {information}
            <br/>
            {changePassBtn}
            <br/>
            {logoutBtn}
        </div>
    )

    const editScreen = (
        <div id='editScreen'>
            {infoToChange !== 'password' ?
                <>
                    <label>{`New ${infoToChange}`}:</label><br/>
                    <input id='editField1' type='text'/><br/>
                </>
                :
                <>
                    <label>New password:</label><br/>
                    <input id='editField2' type='text'/><br/>
                    <label>Confirm new password:</label><br/>
                    <input id='editField3' type='text'/><br/>
                </>
            }

            <button id='submitBtn' onClick={() => {
                const main = document.getElementById('profilePageStart')
                const newNode = document.createElement('div')
                main.parentNode.insertBefore(newNode, main)
                if (infoToChange === 'password') {
                    const pass = document.getElementById('editField2').value,
                        confPass = document.getElementById('editField3').value
                    if (pass !== confPass) {
                        ReactDOM.render(
                            <Alert message='Passwords don`t match' type="error" closeText='Close now'/>,
                            newNode,
                        );
                        return
                    }
                }
                const data = infoToChange === 'password' ? {
                        ownerToken: sessionStorage.getItem('token'),
                        password: document.getElementById('editField2').value
                    }
                    :
                    infoToChange === 'username' ? {
                            ownerToken: sessionStorage.getItem('token'),
                            username: document.getElementById('editField1').value
                        }
                        :
                        {
                            ownerToken: sessionStorage.getItem('token'),
                            email: document.getElementById('editField1').value
                        }
                fetch(`http://localhost:8000/users/${sessionStorage.getItem('userId')}`, {
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
                            if (infoToChange !== 'password') {
                                sessionStorage.setItem(infoToChange, document.getElementById('editField1').value)
                            } else {
                                sessionStorage.setItem(infoToChange, document.getElementById('editField2').value)
                            }
                            window.location.reload()
                        } else {
                            ReactDOM.render(
                                <Alert message={result.message} type="error" closeText='Close now'/>,
                                newNode,
                            );
                            setScreen('profile')
                        }

                    })
            }}>
                Submit changes
            </button>

            <button id='cancelEditBtn' onClick={() => {
                setScreen('profile')
            }}>Cancel
            </button>

        </div>
    )

    return (
        <>
            <br id='profilePageStart'/>
            {screen === 'profile' ? profileScreen : editScreen}
        </>

    )
}

export default Profile