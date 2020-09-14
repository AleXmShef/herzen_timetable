import React, {Component} from 'react';
import {Accordion, Card, Button} from "react-bootstrap";
import PropTypes from 'prop-types';

class TimetableCard extends Component {
    constructor(props) {
        super(props);
    }
    testFunc(e) {
        console.log("test", e);
    }
    render() {
        let header_name_processed = this.props.header_name;
        let index = this.props.index;
        header_name_processed = header_name_processed.charAt(0).toUpperCase() + header_name_processed.slice(1);
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle
                        as={Button}
                        onClick={(e) => {this.props.func_advance(this.props.header_name, this.props.index, e)}}
                        variant="link"
                        style={{'textAlign': 'left'}}
                        eventKey={index}
                    >
                        {header_name_processed}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                    <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}

TimetableCard.propTypes = {
    header_name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    func_advance: PropTypes.func.isRequired
};

export default TimetableCard;
