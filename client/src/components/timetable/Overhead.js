import React, {Component} from 'react';
import {Button, Card, Col, Container, Jumbotron, Nav, NavDropdown, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import {CheckAll} from "react-bootstrap-icons";

class Overhead extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Jumbotron style={{marginBottom: 40}} className="text-center">
                <h1>
                    {"Группа " + this.props.groupName}
                </h1>
                <Row className="justify-content-center" noGutters>
                    <Col xs="auto">
                        <Button variant='link' onClick={() => {this.props.changeWeek("impede")}}>
                            <Icon.ChevronDoubleLeft size={24}/>
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <h5 style={{padding: 6}}>
                            {this.props.weekBegin.getDate ? (
                                this.props.weekBegin.getDate() +
                                " " +
                                this.props.months[this.props.weekBegin.getMonth()] +
                                " — " +
                                this.props.weekEnd.getDate() +
                                " " +
                                this.props.months[this.props.weekEnd.getMonth()]) : "none"
                            }
                        </h5>
                    </Col>
                    <Col xs="auto">
                        <Button variant='link' onClick={() => {this.props.changeWeek("advance")}}>
                            <Icon.ChevronDoubleRight size={24}/>
                        </Button>
                    </Col>
                </Row>
                <h5>
                    {(this.props.isOddWeek ? "нижняя" : "верхняя") +  " неделя"}
                </h5>
                {(this.props.subgroupsNumber > 1) ?
                <Nav className="justify-content-center" onSelect={(eventKey) => {this.props.changeSubgroup(eventKey)}}>
                    <NavDropdown id={"subgroups_dropdown"} title={"Подгруппа"}>
                        <NavDropdown.Item eventKey={1} active={(this.props.activeSubgroup === 0)}>Подгруппа 1</NavDropdown.Item>
                        <NavDropdown.Item eventKey={2} active={(this.props.activeSubgroup === 1)}>Подгруппа 2</NavDropdown.Item>
                    </NavDropdown>
                </Nav> : undefined}
            </Jumbotron>
        );
    }
}

Overhead.propTypes = {
    isOddWeek: PropTypes.number.isRequired,
    weekBegin: PropTypes.object.isRequired,
    weekEnd: PropTypes.object.isRequired,
    months: PropTypes.array.isRequired,
    changeWeek: PropTypes.func.isRequired,
    groupName: PropTypes.string.isRequired,
    activeSubgroup: PropTypes.number.isRequired,
    changeSubgroup: PropTypes.func.isRequired,
    subgroupsNumber: PropTypes.number.isRequired
};

export default Overhead;
