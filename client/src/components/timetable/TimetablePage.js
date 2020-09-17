import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Accordion, Col, Container, Row} from "react-bootstrap";

import axios from 'axios';

import DayCard from "./DayCard";

class TimetablePage extends Component {

    constructor(props) {
        super(props);
        let group = localStorage.getItem('group');
        if(!group) {
            this.props.history.push('/');
        }
        else {
            group = JSON.parse(group);
            this.state = {
                group: group,
                timetable: {}
            }
        }
    }

    componentDidMount() {
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

    render() {
        return (
            <Container className="justify-content-md-center" style={{marginTop: 150}}>
                {this.state.timetable.days ? this.state.timetable.days.map(day => {
                    return <DayCard key={day.day} day={day}/>
                }) : undefined}
            </Container>
        );
    }
}

TimetablePage.propTypes = {};

export default TimetablePage;
