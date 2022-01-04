const initialState = {screen: 'profile', infoToChange: 'username'}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'return': {
            return {...state, screen:'profile', infoToChange: 'username'}
        }
        case 'username': {
            return {...state, screen:'edit'}
        }
        case 'email': {
            return {...state, screen:'edit', infoToChange: 'email'}
        }
        case 'password': {
            return {...state, screen:'edit', infoToChange: 'password'}
        }
        default: {
            return state
        }
    }
}

export {initialState, profileReducer}