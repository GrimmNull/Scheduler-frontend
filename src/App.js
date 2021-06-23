import './stylesheets/App.scss'
import './stylesheets/Alert.scss'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DesktopOutlined, FormOutlined } from '@ant-design/icons';
import TaskScreen from './pages/TaskScreen.js'
import Profile from './pages/Profile.js'
import Auth from './pages/Auth.js'
import Homepage from './pages/Homepage.js'
import {AuthProvider, AuthConsumer} from './contexts/Auth.js'
import {useState} from 'react'

const { Sider, Content } = Layout;

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

function App(props) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <AuthProvider>
            <AuthConsumer>
                {({state, dispatch}) => (
                    <BrowserRouter>
                        <Layout
                            style={{ minHeight: '100vh' }}
                        >
                            <Sider
                                collapsible
                                collapsed={isSidebarCollapsed}
                                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                            >
                                <Menu
                                    theme="dark"
                                    defaultSelectedKeys={[`${getStartPage()}`]}
                                    mode="inline"
                                >
                                    <Menu.Item
                                        key="1"
                                        icon={<DesktopOutlined />}
                                    >
                                        <Link to='/homepage'>Homepage</Link>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="2"
                                        icon={<FormOutlined />}
                                    >
                                        <Link to='/TaskScreen'>Tasks</Link>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="3"
                                        icon={<DesktopOutlined />}
                                    >
                                        {state.auth ? <Link to='/Profile'> {sessionStorage.getItem('username')}</Link> : <Link to='/Auth'> Login</Link>}
                                    </Menu.Item>
                                </Menu>
                            </Sider>
                            <Content>
                                <Switch>
                                    <Route exact path={['/', '/homepage']} component={Homepage} />
                                    <Route exact path={['/', '/TaskScreen']} component={TaskScreen} />
                                    {state.auth ? <Route exact path='/Profile' component={Profile} /> : <Route exact path='/Auth' component={Auth} />}

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
