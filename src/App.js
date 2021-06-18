import './stylesheets/App.scss';
import TaskScreen from './components/TaskScreen.js'
import Profile from './components/Profile.js'
import Auth from './components/Auth.js'
import {useEffect, useState} from 'react'



function App() {

    let [page,setPage] = useState('tasks')
    const [logged, setLogged] = useState(sessionStorage.getItem('logged'))
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
            console.log(logged)
            if (sessionStorage.getItem('logged')==='true'){
                sessionStorage.setItem('logged', false)
            } else {
                sessionStorage.setItem('logged',true)
            }
        }}> Change logged status</button>
    )

    const pageContent = (
        <div>
            <nav>
                <button onClick={() => setPage('tasks')}>
                    Tasks page
                </button>
                {testButton}
                {logged==='true' ? profileButton : authButton}
            </nav>
            {page === 'tasks' ? <TaskScreen/> : logged ? <Profile/> : <Auth/>}
        </div>
    )

    useEffect(() =>{
        setLogged(sessionStorage.getItem('logged'))
    })

    return pageContent
}

export default App;
