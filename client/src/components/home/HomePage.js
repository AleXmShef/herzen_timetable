import React, {Component} from 'react';
import {Container, Col, Row, Accordion, Card, Button} from "react-bootstrap";
import PropTypes from 'prop-types';

import TimetableCard from "./TimetableCard";

import axios from 'axios';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stageEnum: {
                facultySelection: 1,
                typeSelection: 2,
                levelSelection: 3,
                programSelection: 4,
                subprogramSelection: 5,
                yearSelection: 6,
                groupSelection: 7
            },
            currentStage: 1,
            faculties: [],
            active_faculty: -1,
            types: [],
            active_type: -1,
            levels: [],
            active_level: -1,
            programs: [],
            active_program: -1,
            subprograms: [],
            active_subprogram: -1,
            years: [],
            active_year: -1,
            groups: []
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        axios.get('/api/timetable/faculties').then((res) => {
            this.setState({faculties: res.data.faculties});
        }).catch((err) => {
            console.log(err);
        })
    }

    getData(e) {
        switch(this.state.currentStage) {
            case this.state.stageEnum.facultySelection : {

            }
        }
    }

    render() {
        return (this.state.currentStage > 0 && this.state.faculties.length > 0) ? (
            <Container style={{marginTop: 150}}>
                <Row className="justify-content-md-center">
                    <Col md style={{'marginBottom': 50}}>
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    Факультеты/институты
                                </Card.Header>
                            </Card>
                            {this.state.faculties.map(faculty => {
                                const index = this.state.faculties.indexOf(faculty) + 1;
                                return (<TimetableCard func_advance={this.getData} key={index} header_name={faculty.faculty} index={index}/>);
                            })}
                        </Accordion>
                    </Col>
                    <Col md>
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        ) : <div></div>;
    }
}

HomePage.propTypes = {

};

export default HomePage;
