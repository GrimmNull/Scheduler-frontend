const initialState = {
    loading: false,
    finished: false,
    resultedMessage: ''
}

const taskFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'finished' : {
            return {...state, finished:true}
        }
        case 'loaded' : {
            return {...state, loading: false}
        }
        case 'result': {
            return {...state, resultedMessage: action.payload}
        }
        default: {
            return state
        }
    }
}

export {initialState, taskFormReducer}