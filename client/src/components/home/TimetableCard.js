import React, {Component} from 'react';
import {Accordion, Card, Button, Spinner} from "react-bootstrap";
import PropTypes from 'prop-types';

class TimetableCard extends Component {
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
                        onClick={(e) => {this.props.func_advance(this.props.stage, index, this.props.header_name, e)}}
                        variant="link"
                        style={{'textAlign': 'left'}}
                        eventKey={index}
                    >
                        {header_name_processed}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                    <Accordion style={{marginLeft: 10, marginRight: 10}}>
                        {(this.props.children || this.props.stage === 7) ? this.props.children :
                            <div className='d-flex justify-content-center'>
                                <Spinner style={{margin: 8, justifyContent: 'center'}} animation='border' variant='primary'/>
                            </div>}
                    </Accordion>
                </Accordion.Collapse>
            </Card>
        );
    }
}

TimetableCard.propTypes = {
    header_name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    func_advance: PropTypes.func.isRequired,
    stage: PropTypes.number.isRequired
};

export default TimetableCard;
