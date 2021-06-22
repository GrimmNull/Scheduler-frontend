import triggerAlert from "../triggerAlert";


function Profile(props){
    const informations=(
        <div id='infos'>
            <h3>User id: {sessionStorage.getItem('userId')}</h3>
            <h3>Username:{sessionStorage.getItem('username')}</h3>
        </div>
    )

    const logoutBtn= <button onClick={() => {
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('expiresAt')
        sessionStorage.removeItem('auth')
        triggerAlert('You have successfully logged out')
    }}>
        Logout
    </button>

    return (
        <div>
            {informations}
            {logoutBtn}
        </div>
    )
}

export default Profile