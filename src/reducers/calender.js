import * as types from '../actions/actionsTypes';

export default function calenderReducer(state = {events: []}, action) {
    switch(action.type) {
        case types.LOAD_EVENTS_SUCCESS:
            return {...state, events: action.events};
        default:
            return state;
    }
}
