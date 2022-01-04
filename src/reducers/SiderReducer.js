
const initialState = {
    collapsed: false
}

const siderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'change': {
            return {...state, collapsed: action.payload}
        }
        default : {
            return state
        }
    }
}

export {initialState, siderReducer}