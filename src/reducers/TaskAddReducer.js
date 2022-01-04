
const initialState= {
    loading: false,
    visible: false
}

const taskAddReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'loaded': {
            return {...state, loading: false}
        }
        case 'unloaded': {
            return {...state, loading: true}
        }
        case 'visible': {
            return {...state, visible: true}
        }
        case 'hidden': {
            return {...state, visible: false}
        }
        default: {
            return state
        }
    }
}

export {initialState, taskAddReducer}