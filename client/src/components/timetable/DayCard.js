import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, ListGroup, ListGroupItem, Row, Col} from "react-bootstrap";

class DayCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            months: [
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
            ],
            isRemote: 0
        }
    }

    componentDidMount() {
        this.props.day.hours.forEach(hour => {
            let week = (hour.weeks[this.state.isOddWeek]) ? (hour.weeks[this.state.isOddWeek]) : hour.weeks[0];
            if(this.parseClasses(week.classes).place && !this.parseClasses(week.classes).place.includes("дист"))
                this.setState({isRemote: 1});
        })
    }

    parseClasses(classes) {
        let __class = 0;
        classes.forEach(_class => {
            _class.dates.forEach(date => {
                if (date.type === "singular") {
                    if (date.date === this.props.currentDateMil) {
                        __class = _class;
                    }
                } else if (date.type === "interval")
                    if (this.props.currentDateMil >= date.begin && this.props.currentDateMil <= date.end)
                        __class =  _class;
            })
        })
        return __class;
    }

    render() {
        return (
            <Card style={{marginBottom: 40}} bg={this.state.isRemote ? 'light' : 'default'}>
                <Card.Header>
                    {
                        this.props.day.day +
                        ", " +
                        this.props.currentDate.getDate() +
                        " " +
                        this.state.months[this.props.currentDate.getMonth()]
                    }
                </Card.Header>
                <ListGroup variant='flush'>
                    {this.props.day.hours.map(hour => {
                        let week = hour.weeks[this.props.isOddWeek] ? this.props.isOddWeek : 0;
                        let _class = this.parseClasses(hour.weeks[week].classes);
                        return _class ?
                            <ListGroupItem key={hour.timespan}>
                            <Row>
                                <Col sm>
                                    {hour.timespan}
                                </Col>
                                <Col md>
                                    {
                                        (_class.moodle_link && _class.moodle_link !== "none") ?
                                            <a href={_class.moodle_link} target='_blank' rel='noopener noreferrer'>{_class.class + " " + _class.type}</a>
                                            :
                                            _class.class + " " + _class.type
                                    }
                                </Col>
                                <Col md>
                                    {_class.teacher}
                                </Col>
                                <Col md>
                                    {_class.place}
                                </Col>
                            </Row>
                        </ListGroupItem> : undefined
                    })}
                </ListGroup>
            </Card>
        );
    }
}

DayCard.propTypes = {
    day: PropTypes.object.isRequired,
    isOddWeek: PropTypes.number.isRequired,
    currentDateMil: PropTypes.number.isRequired,
    currentDate: PropTypes.object.isRequired
};

export default DayCard;
