import './stylesheets/App.scss';
import TaskScreen from './components/TaskScreen.js'
import Profile from './components/Profile.js'
import Auth from './components/Auth.js'
import {useState} from 'react'



function App() {

    let [page,setPage] = useState('tasks')
    const [logged, setLogged] = useState(false)
    const authButton = (
        <button onClick={() => setPage('auth')}>
            Login
        </button>
    )
    const profileButton = (
        <button onClick={() => setPage('profile')}>
            {sessionStorage.getItem('username')}
        </button>
    )

    const pageContent = (
        <div>
            <nav>
                <button onClick={() => setPage('tasks')}>
                    Tasks page
                </button>

                {logged ? profileButton : authButton}
            </nav>
            {page === 'tasks' ? <TaskScreen/> : logged ? <Profile/> : <Auth/>}
        </div>
    )

    return pageContent
}

export default App;
