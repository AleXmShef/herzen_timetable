import React, {Component} from 'react';
import {Container, Image, Jumbotron, Row, Col, Button, Media} from "react-bootstrap";
import PropTypes from 'prop-types';

class About extends Component {
    render() {
        return (
            <Container className="justify-content-md-center" style={{marginTop: 150}}>
                    <Jumbotron style={{paddingBottom: 32}}>
                        <Row>
                            <Col md style={{paddingBottom: window.screen.width  < 768 ? 50 : 0}}>
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
                                <div className='row align-items-end justify-content-center' style={{height: 100, paddingLeft: 15}}>
                                    <Image src='/img/mern-logo.png' style={{width:120}}/>
                                </div>
                            </Col>
                            <Col>
                                <Image src='/img/about.jpg' fluid style={{minWidth: 260, borderRadius: '5px'}}/>
                            </Col>
                        </Row>
                    </Jumbotron>

            </Container>
        );
    }
}

About.propTypes = {};

export default About;
