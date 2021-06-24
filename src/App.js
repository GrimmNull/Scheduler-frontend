import './stylesheets/App.scss'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import {DesktopOutlined, FormOutlined, IdcardOutlined} from '@ant-design/icons';
import TaskScreen from './pages/TaskScreen.js'
import Profile from './pages/Profile.js'
import Auth from './pages/Auth.js'
import Homepage from './pages/Homepage.js'
import {AuthProvider, AuthConsumer} from './contexts/Auth.js'
import {useEffect, useState} from 'react'

const {Sider, Content} = Layout;


function App(props) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


    //verificam daca token-ul userului a expirat sau nu
    useEffect(() => {
        const data = new Date(sessionStorage.getItem('expiresAt'))
        const data2 = new Date()
        if (data < data2) {
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('email')
            sessionStorage.removeItem('userId')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('expiresAt')
            sessionStorage.removeItem('auth')
        }
    }, [])

    //Pagina principala este de fapt sidebar-ul si din el selectam pagina pe care s-o incarcam
    return (
        //utilizam un context de autentificare pentru a evita sa folosim redux :D
        <AuthProvider>
            <AuthConsumer>
                {({state, dispatch}) => (
                    <BrowserRouter>
                        <Layout
                            style={{minHeight: '100vh'}}
                        >
                            <Sider
                                collapsible
                                collapsed={isSidebarCollapsed}
                                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                            >
                                <Menu
                                    theme="dark"
                                    defaultSelectedKeys={[`1`]}
                                    mode="inline"
                                >
                                    <Menu.Item
                                        key="1"
                                        icon={<DesktopOutlined/>}
                                    >
                                        <Link to='/homepage'>Homepage</Link>
                                    </Menu.Item>
                                    {//ne asiguram mai intai ca avem un user logat inainte de a-i permite accesul la pagina de task-uri
                                        state.auth ? <Menu.Item
                                            key="2"
                                            icon={<FormOutlined/>}
                                        >
                                            <Link to='/TaskScreen'>Tasks</Link>
                                        </Menu.Item> : ''}

                                    <Menu.Item
                                        key="3"
                                        icon={<IdcardOutlined/>}
                                    >
                                        {state.auth ? <Link to='/Profile'> {sessionStorage.getItem('username')}</Link> :
                                            <Link to='/Auth'> Login</Link>}
                                    </Menu.Item>
                                </Menu>
                            </Sider>
                            <Content>
                                <Switch>
                                    <Route exact path={['/', '/homepage']} component={Homepage}/>
                                    <Route exact path={['/', '/TaskScreen']} component={TaskScreen}/>
                                    {state.auth ? <Route exact path='/Profile' component={Profile}/> :
                                        <Route exact path='/Auth' component={Auth}/>}

                                </Switch>
                            </Content>
                        </Layout>
                    </BrowserRouter>

                )}

            </AuthConsumer>
        </AuthProvider>


    );
};


export default App;
