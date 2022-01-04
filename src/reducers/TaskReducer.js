
const initialState= {
    taskId: null,
    parentTaskId: null,
    description: '',
    startTime: new Date(),
    deadline: new Date(),
    completed: false,
    failed: false,
    categories:[]
}

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'set': {
            return {...state, ...action.payload}
        }
        default: {
            return state
        }
    }
}

export {initialState, taskReducer}