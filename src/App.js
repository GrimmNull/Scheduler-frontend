import './stylesheets/App.scss'
import {BrowserRouter, Link, Redirect, Route, Switch} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import {DesktopOutlined, FormOutlined, IdcardOutlined} from '@ant-design/icons';
import TaskScreen from './pages/TaskScreen.js'
import Profile from './pages/Profile.js'
import Homepage from './pages/Homepage.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'
import {useAuth} from './contexts/Auth.js'
import {useEffect, useReducer} from 'react'
import {initialState, siderReducer} from "./reducers/SiderReducer";

const {Sider, Content} = Layout;

function getStartPage() {
    const page = sessionStorage.getItem('currentPage')
    if (page) {
        return page
    }
    return 3
}

function setCurrentPage(page) {
    sessionStorage.setItem('currentPage', page)
}


function App(props) {
    const [siderState, siderDispatch] = useReducer(siderReducer, initialState)
    const auth=useAuth(state => state.auth)
    //verificam daca token-ul userului a expirat sau nu
    useEffect(() => {
        const data = new Date(localStorage.getItem('expiresAt'))
        const data2 = new Date()
        if (data < data2) {
            localStorage.removeItem('username')
            localStorage.removeItem('email')
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            localStorage.removeItem('expiresAt')
            localStorage.removeItem('auth')
        }
    }, [])

    //Pagina principala este de fapt sidebar-ul si din el selectam pagina pe care s-o incarcam
    return (
        //utilizam un context de autentificare pentru a evita sa folosim redux
                    <BrowserRouter>
                        <Layout
                            style={{minHeight: '100vh'}}
                        >
                            <Sider
                                collapsible
                                collapsed={siderState.collapsed}
                                onCollapse={(collapsed) => {
                                    siderDispatch({type: 'change', payload: collapsed})
                                }}
                            >
                                <Menu
                                    theme="dark"
                                    defaultSelectedKeys={[`${getStartPage()}`]}
                                    mode="inline"
                                >
                                    {
                                        auth ? <Menu.Item
                                            key="1"
                                            icon={<DesktopOutlined/>}
                                            onClick={() => setCurrentPage(1)}
                                        >
                                            <Link to='/homepage'>Homepage</Link>
                                        </Menu.Item> : ''
                                    }

                                    {//ne asiguram mai intai ca avem un user logat inainte de a-i permite accesul la pagina de task-uri
                                        auth ? <Menu.Item
                                            key="2"
                                            icon={<FormOutlined/>}
                                            onClick={() => setCurrentPage(2)}
                                        >
                                            <Link to='/taskscreen'>Tasks</Link>
                                        </Menu.Item> : ''}

                                    <Menu.Item
                                        key="3"
                                        icon={<IdcardOutlined/>}
                                        onClick={() => setCurrentPage(3)}
                                    >
                                        {auth ? <Link to='/profile'> {localStorage.getItem('username')}</Link> :
                                            <Link to='/login'> Login</Link>}
                                    </Menu.Item>
                                </Menu>
                            </Sider>
                            <Content>
                                <Switch>
                                    <Route exact path='/'><Redirect to='/login'/></Route>
                                    <Route exact path='/homepage' component={Homepage}/>
                                    <Route exact path='/taskscreen' component={TaskScreen}/>
                                    <Route exact path='/profile' component={Profile}/>
                                    <Route exact path='/login' component={Login}/>
                                    <Route exact path='/register' component={Register}/>

                                </Switch>
                            </Content>
                        </Layout>
                    </BrowserRouter>
    );
};


export default App;
