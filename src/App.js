import './stylesheets/App.scss';
import TaskScreen from './components/TaskScreen.js'
import Profile from './components/Profile.js'
import Auth from './components/Auth.js'
import {AuthProvider, AuthConsumer, useAuth} from './contexts/Auth.js'
import {useContext, useEffect, useState} from 'react'

function App() {
    let [page, setPage] = useState('tasks')
    const [loggedin, setLoggedin] = useState(false)
    const authButton = (
        <button onClick={() => setPage('auth')}>
            Login
        </button>
    )
    const profileButton = (
        <button onClick={() => setPage('profile')}>
            Brandon
        </button>
    )

    const testButton = (

        <button onClick={() => {
            console.log(loggedin)
            setLoggedin(!loggedin)
        }}> Change logged status</button>

    )

    const pageContent = (
        <AuthProvider>
            <AuthConsumer>
                {({state, dispatch}) => (
                    <div>
                        <nav>
                            <button onClick={() => setPage('tasks')}>
                                Tasks page
                            </button>
                            {testButton}
                            {state.auth ? profileButton : authButton}
                        </nav>
                        {page === 'tasks' ? <TaskScreen/> : state.auth ? <Profile/> : <Auth/>}
                    </div>

                )}

            </AuthConsumer>
        </AuthProvider>
    )


    return pageContent
}

export default App;
