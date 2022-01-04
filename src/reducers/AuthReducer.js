const initialState = {screen: 'login'}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'login' : {
            return {...state, screen: 'login'}
        }
        case 'register': {
            return {...state, screen: 'register'}
        }
        default:
            return state
    }
}

export {initialState, authReducer}