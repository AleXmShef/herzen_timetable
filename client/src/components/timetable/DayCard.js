import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, ListGroup, ListGroupItem, Row, Col} from "react-bootstrap";

class DayCard extends Component {
    constructor(props) {
        super(props);
        const temp = new Date(Date.now());
        const currentDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
        let firstSeptember = new Date(temp.getFullYear(), 8, 1);
        let temp2 = firstSeptember.getTime();
        for(let i = firstSeptember.getDay(); i > 0; i--)
            temp2-= 24 * 60 * 60 * 1000;
        let weekBegin = new Date(temp2);
        const isOdd = this.isOddWeek(weekBegin.getTime(), currentDate.getTime());
        this.state = {
            currentDate: currentDate,
            currentDateMil: currentDate.getTime(),
            currentWeekBegin: temp2,
            isOddWeek: isOdd
        }

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
        return (
            <Card style={{marginBottom: 40}}>
                <Card.Header>
                    {this.props.day.day}
                </Card.Header>
                <ListGroup>
                    {this.props.day.hours.map(hour => {
                        return <ListGroupItem key={hour.timespan}>
                            <Row>
                                <Col sm>
                                    {hour.timespan}
                                </Col>
                                <Col md>
                                    {hour.weeks[this.state.isOddWeek].classes.map(_class => {
                                        return _class.dates.map(date => {
                                            if(date.type === "singular") {
                                                console.log("class date " + date.date);
                                                console.log("current date " + this.state.currentDateMil);
                                                if (date.date === this.state.currentDateMil) {
                                                    return _class.class;
                                                }
                                            }
                                            else if(date.type === "interval")
                                                if(this.state.currentDateMil >= date.begin && this.state.currentDateMil <= date.end)
                                                    return _class.class;
                                        })
                                    })}
                                </Col>
                                <Col md>
                                    {hour.timespan}
                                </Col>
                            </Row>
                        </ListGroupItem>
                    })}
                </ListGroup>
            </Card>
        );
    }
}

DayCard.propTypes = {
    day: PropTypes.object.isRequired
};

export default DayCard;
