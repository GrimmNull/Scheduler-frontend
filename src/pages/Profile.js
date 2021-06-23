import * as ReactDOM from "react-dom";
import {Alert} from "antd";


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
        ReactDOM.render(
            <Alert message="You have successfully logged out" type="success" />,
            document.getElementById('container'),
        );
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