import React, {Component} from 'react';
import {Container, Spinner} from "react-bootstrap";
import axios from 'axios';

import DayCard from "./DayCard";
import Overhead from "./Overhead";

const Months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
];

class TimetablePage extends Component {
    constructor(props) {
        super(props);
        let group = localStorage.getItem('group');
        let subgroup = 0;
        let shouldRender = true;
        if(!group) {
            shouldRender = false;
        }
        else {
            group = JSON.parse(group);
            subgroup = localStorage.getItem('subgroup');
            if(!subgroup)
                subgroup = 0;
            else
                subgroup = Number(subgroup);
        }
        this.state = {
            days: [
                "понедельник",
                "вторник",
                "среда",
                "четверг",
                "пятница",
                "суббота",
                "воскресенье"
            ],
            shouldRender: shouldRender,
            group: group,
            subgroup: subgroup,
            timetable: {},
            currentDate: 0,
            currentDateMil: Date.now(),
            currentWeekBegin: {},
            currentWeekBeginMil: 0,
            currentWeekEnd: {},
            currentWeekEndMil: 0,
            isOddWeek: 0
        }
        this.changeWeek = this.changeWeek.bind(this);
        this.changeSubgroup = this.changeSubgroup.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0,0);

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

    changeSubgroup(subgroup) {
        if(this.state.subgroups !== subgroup - 1) {
            localStorage.setItem('subgroup', (subgroup - 1).toString());
            this.setState({subgroup: subgroup - 1});
        }
    }

    parseDates() {
        let currentDateMil = new Date(this.state.currentDateMil);
        const currentDate = new Date(currentDateMil.getFullYear(), currentDateMil.getMonth(), currentDateMil.getDate());
        currentDateMil = currentDate.getTime();

        let firstSeptember = new Date(currentDate.getFullYear(), 8, 1);
        let firstSeptemberMil = firstSeptember.getTime();

        for(let i = firstSeptember.getDay(); i > 1; i--)
            firstSeptemberMil-= 24 * 60 * 60 * 1000;

        let yearWeekBegin = new Date(firstSeptemberMil);
        const isOdd = this.isOddWeek(yearWeekBegin.getTime(), currentDate.getTime());

        let currentWeekBeginMil = currentDateMil - 24 * 60 * 60 * 1000 * (currentDate.getDay() - 1);
        let currentWeekBegin = new Date(currentWeekBeginMil);

        let currentWeekEndMil = currentWeekBeginMil + 6 * 24 * 60 * 60 * 1000;
        let currentWeekEnd = new Date(currentWeekEndMil);

        this.setState ({
            currentDate: currentDate,
            currentDateMil: currentDate.getTime(),
            currentWeekBegin: currentWeekBegin,
            currentWeekBeginMil: currentWeekBeginMil,
            currentWeekEnd: currentWeekEnd,
            currentWeekEndMil: currentWeekEndMil,
            isOddWeek: isOdd
        });
    }

    isOddWeek(start, check) {
        let begin = start;
        let isOdd = 0;
        while(begin < check) {
            begin += 7 * 24 * 60 * 60 * 1000;
            if(isOdd === 1)
                isOdd = 0;
            else
                isOdd = 1;
        }
        return isOdd;
    }

    changeWeek(action) {
        if(action === "advance") {
            let newDate = this.state.currentDateMil + 7 * 24 * 60 * 60 * 1000;
            this.setState({currentDateMil: newDate}, () => {this.parseDates()});
        }
        if(action === "impede") {
            let newDate = this.state.currentDateMil - 7 * 24 * 60 * 60 * 1000;
            this.setState({currentDateMil: newDate}, () => {this.parseDates()});
        }

    }

    render() {
        let {shouldRender, timetable, group, subgroup} = this.state;
        return shouldRender && (

            <Container className="justify-content-md-center" style={{marginTop: 150}}>
                <Overhead
                    isOddWeek={this.state.isOddWeek}
                    weekBegin={this.state.currentWeekBegin}
                    weekEnd={this.state.currentWeekEnd}
                    months={Months}
                    changeWeek={this.changeWeek}
                    groupName={group.group}
                    activeSubgroup={subgroup}
                    changeSubgroup={this.changeSubgroup}
                    subgroupsNumber={(timetable.subgroups) ? timetable.subgroups.length : 1}
                />
                {( timetable.subgroups && timetable.subgroups[subgroup] && timetable.subgroups[subgroup].days) ? timetable.subgroups[subgroup].days.map(day => {
                    const dayDateMil =
                        this.state.currentWeekBeginMil +
                       this.state.days.indexOf(day.day) *
                        24*60*60*1000;

                    const dayDate = new Date(dayDateMil);

                    return <DayCard
                        key={day.day}
                        day={day}
                        isOddWeek={this.state.isOddWeek}
                        currentDateMil={dayDateMil}
                        currentDate={dayDate}
                        months={Months}
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
