import * as types from './actionsTypes';
import axios from 'axios';
import moment from 'moment';

export function loadEventsSuccess(events) {
    return {type: types.LOAD_EVENTS_SUCCESS, events};
}

export function loadEvents(startDate, endDate) {
    return function(dispatch) {
        axios({
            method: 'post',
            url: 'http://112.196.104.171:3001/api/GetEvents',
            data: {
                start_date: moment(startDate).format("YYYY-MM-DD"),
                end_date: moment(endDate).format("YYYY-MM-DD")
            }
        }).then(function (response) {
            dispatch(loadEventsSuccess(response.data.result))
        })
        .catch(function (error) {
            console.log(error);
        });
    };
}
