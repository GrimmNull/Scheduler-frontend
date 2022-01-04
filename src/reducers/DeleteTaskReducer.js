const initialState = {
    deleted: false
}

const deleteTaskReducer= (state = initialState, action) => {
    switch (action.type) {
        case 'deleted': {
            return {...state, deleted: true}
        }
        default: {
            return state
        }
    }
}

export {initialState, deleteTaskReducer}