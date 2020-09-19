import React, {Component} from 'react';
import {Container, Image, Jumbotron, Row, Col, Button} from "react-bootstrap";
import PropTypes from 'prop-types';

class About extends Component {
    render() {
        return (
            <Container className="justify-content-md-center" style={{marginTop: 150}}>
                    <Jumbotron>
                        <Row>
                            <Col sm-2>
                                <h1>Ну дарова</h1>
                                <p>
                                    Я даже не знаю че тебе забаклякать.
                                    Это короче адекватный сайт с расписанием для студентов Герцухи.
                                    Он не имеет ничего общего с официальным сайтом и поддерживается личной мной
                                    - студентом первого курса ИИТТО на направлении ИВТ, Саней.
                                </p>
                                <Button
                                    variant='primary'
                                    href='https://github.com/HuiloIvanovich/herzen_timetable'
                                    target='_blank'
                                >
                                    GitHub
                                </Button>
                            </Col>
                            <Col md="auto">
                                <Image src='/img/about.jpg' style={{width: 400}}/>
                            </Col>
                        </Row>
                    </Jumbotron>

            </Container>
        );
    }
}

About.propTypes = {};

export default About;
