import moment from "moment";

const initialState = {
    stats: [],
    month: moment().format('YYYY-MM-DD')
}

const homepageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'stats': {
            return {...state, stats: action.payload}
        }
        case 'month': {
            return {...state, month: action.payload}
        }
        default: {
            return state
        }
    }
}

export {initialState, homepageReducer}