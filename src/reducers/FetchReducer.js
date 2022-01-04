const initialState = {tasks: [], categoriesTemp:[], loading: true}

const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'load' : {
            return {...state,tasks:action.payload, loading:false}
        }
        case 'categories': {
            return {...state, categoriesTemp: action.payload}
        }
        case 'hide': {
            return {...state, tasks:[], loading:true}
        }
        default:
            return state
    }
}

export {initialState,tasksReducer}