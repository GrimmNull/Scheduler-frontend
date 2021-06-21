import {createContext, useContext, useReducer} from "react";

const AuthContext = createContext(false)

function authReducer(state, action) {
    switch (action.type) {
        case 'connect': {
            return {auth: true}
        }
        case 'disconnect': {
            return {auth: false}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function AuthProvider({children}) {
    const [state, dispatch] = useReducer(authReducer, {auth: false})

    const value = {state, dispatch}

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function AuthConsumer({children}) {
    return (
        <AuthContext.Consumer>
            {context => {
                if(context === undefined){
                    throw new Error('AuthConsumer must be used within an AuthProvider')
                }
                return children(context)
            }}
        </AuthContext.Consumer>
    )
}

function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}


export {AuthProvider, AuthConsumer, useAuth}

//https://kentcdodds.com/blog/how-to-use-react-context-effectively