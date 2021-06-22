import './stylesheets/App.scss'
import './stylesheets/Alert.scss'
import TaskScreen from './components/TaskScreen.js'
import Profile from './components/Profile.js'
import Auth from './components/Auth.js'
import Homepage from './components/Homepage.js'
import triggerAlert from './triggerAlert.js'
import {AuthProvider, AuthConsumer} from './contexts/Auth.js'
import {useState} from 'react'


function getStartPage() {
    const page = sessionStorage.getItem('currentPage')
    if (page) {
        return page
    }
    return 'tasks'
}

function setCurrentPage(setter, page) {
    setter(page)
    sessionStorage.setItem('currentPage', page)
}


function App() {
    let [page, setPage] = useState(getStartPage())
    const authButton = (
        <button onClick={() => setCurrentPage(setPage, 'auth')}>
            Login
        </button>
    )
    const profileButton = (
        <button onClick={() => setCurrentPage(setPage, 'profile')}>
            {sessionStorage.getItem('username')}
        </button>
    )


    const pageContent = (
        <AuthProvider>
            <AuthConsumer>
                {({state, dispatch}) => (
                    <div>
                        <nav id='navbar'>
                            <button onClick={() => setCurrentPage(setPage, 'tasks')}>
                                Tasks page
                            </button>
                            <button onClick={() => triggerAlert('test')}>Test Alert</button>
                            {state.auth ? profileButton : authButton}
                        </nav>
                        {page === 'tasks' ? state.auth ? <TaskScreen/> : <Homepage/> : state.auth ? <Profile/> :
                            <Auth/>}
                    </div>

                )}

            </AuthConsumer>
        </AuthProvider>
    )


    return pageContent
}

export default App;
