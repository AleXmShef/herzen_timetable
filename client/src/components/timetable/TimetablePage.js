import React, {Component} from 'react';
import {Container, Spinner} from "react-bootstrap";
import axios from 'axios';

import DayCard from "./DayCard";

class TimetablePage extends Component {
    constructor(props) {
        super(props);
        let group = localStorage.getItem('group');
        let shouldRender = true;
        if(!group) {
            shouldRender = false;
        }
        else {
            group = JSON.parse(group);
        }
        this.state = {
            shouldRender: shouldRender,
            group: group,
            timetable: {},
            currentDate: 0,
            currentDateMil: 0,
            currentWeekBegin: 0,
            currentWeekBeginMil: 0,
            isOddWeek: 0
        }
    }

    componentDidMount() {
        if(this.state.shouldRender) {
            this.parseDates();
            axios.get('/api/timetable/group', {
                params: {
                    groupURL: this.state.group.link
                }
            }).then((res) => {
                this.setState({timetable: res.data});
            }).catch((err) => {
                console.log(err);
            })
        }
        else
            this.props.history.push('/');
    }

    parseDates() {
        let currentDateMil = new Date(Date.now());
        const currentDate = new Date(currentDateMil.getFullYear(), currentDateMil.getMonth(), currentDateMil.getDate());
        currentDateMil = currentDate.getTime();

        let firstSeptember = new Date(currentDate.getFullYear(), 8, 1);
        let firstSeptemberMil = firstSeptember.getTime();

        for(let i = firstSeptember.getDay(); i > 0; i--)
            firstSeptemberMil-= 24 * 60 * 60 * 1000;

        let yearWeekBegin = new Date(firstSeptemberMil);
        const isOdd = this.isOddWeek(yearWeekBegin.getTime(), currentDate.getTime());

        let currentWeekBeginMil = currentDateMil - 24 * 60 * 60 * 1000 * (currentDate.getDay() - 1);
        let currentWeekBegin = new Date(currentWeekBeginMil);

        this.setState ({
            currentDate: currentDate,
            currentDateMil: currentDate.getTime(),
            currentWeekBegin: currentWeekBegin,
            currentWeekBeginMil: currentWeekBeginMil,
            isOddWeek: isOdd
        });
    }

    isOddWeek(start, check) {
        let begin = start;
        let isOdd = 1;
        while(begin <= check) {
            begin += 7 * 24 * 60 * 60 * 1000;
            if(isOdd === 1)
                isOdd = 0;
            else
                isOdd = 1;
        }
        return isOdd;
    }

    render() {
        return this.state.shouldRender && (
            <Container className="justify-content-md-center" style={{marginTop: 150}}>
                {this.state.timetable.days ? this.state.timetable.days.map(day => {
                    const dayDateMil =
                        this.state.currentWeekBeginMil +
                        this.state.timetable.days.indexOf(day) *
                        24*60*60*1000;

                    const dayDate = new Date(dayDateMil);

                    return <DayCard
                        key={day.day}
                        day={day}
                        isOddWeek={this.state.isOddWeek}
                        currentDateMil={dayDateMil}
                        currentDate={dayDate}
                    />
                }) :
                    <div className='d-flex justify-content-center' style={{marginBottom: 2000}}>
                        <Spinner animation='border' variant='primary'/>
                    </div>}
            </Container>
        )
    }
}

TimetablePage.propTypes = {};

export default TimetablePage;
