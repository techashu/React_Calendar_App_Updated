import React from 'react';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {loadEvents} from '../../actions/calender';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './calenderview.css';
import _ from 'lodash';

const localize = momentLocalizer(moment);

class CalenderView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            events: [],
            startDate: null,
            endDate: null,
            requested: false
        };
    }

    componentDidMount() {
        this.props.listEvents();
    }

    dateRangeOverlaps = (firstDateRange, secondDateRange) => {
        if (firstDateRange.start_date <= secondDateRange.start_date && secondDateRange.start_date <= firstDateRange.end_date) return true; // b starts in a
        if (firstDateRange.start_date <= secondDateRange.end_date  && secondDateRange.end_date <= firstDateRange.end_date) return true; // b ends in a
        if (secondDateRange.start_date < firstDateRange.start_date && firstDateRange.end_date < secondDateRange.end_date) return true;
        if (moment(firstDateRange.start_date).format("YYYY-MM-DD") === moment(secondDateRange.start_date).format("YYYY-MM-DD")) return true;
        return false;
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.events !== this.state.events) {
            let events = nextProps.events.map((event) => {
                let duplicate = _.filter(nextProps.events, (item) => {
                    if(this.dateRangeOverlaps(event, item)) {
                        return item;
                    }
                });
                if(duplicate.length > 1) {
                    return ({...event, color: '#ad3131'});
                }
                else {
                    return event;
                }
            });
            this.setState({loading: false, events: events})
        }
    }

    handleChange = (key, value) => {
        this.setState({[key]: value});
    };

    handleSubmit = () => {
        this.setState({loading: true});
        const {startDate, endDate} = this.state;
        this.props.listEvents(startDate, endDate);
    };

    eventStyleGetter = (event) => {
        if(event.color) {
            return{
                style: {
                    backgroundColor: event.color,
                    borderRadius: '0px',
                    opacity: 0.8,
                    color: 'black',
                    border: '0px',
                    display: 'block'
                }
            }
        }
    };

    render() {
        const {loading, events} = this.state;
        return(
            <div>
                <div>
                    StartDate :
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={(value) => this.handleChange('startDate', value)}
                    />
                    EndDate :
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={(value) => this.handleChange('endDate', value)}
                    />
                    <input type="button" className="button" value="Submit" onClick={this.handleSubmit}/>
                </div>
                {
                    !loading && events.length > 0 &&
                    <Calendar
                        localizer={localize}
                        defaultView="month"
                        events={events}
                        defaultDate={new Date(events[0].start_date)}
                        style={{height: "85vh"}}
                        startAccessor="start_date"
                        endAccessor="end_date"
                        eventPropGetter={(this.eventStyleGetter)}
                    />
                }
                {
                    loading &&
                        <div>Loading....</div>
                }
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.calender.events,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // dispatching plain actions
        listEvents: (startDate, endDate) => dispatch(loadEvents(startDate, endDate)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalenderView);
