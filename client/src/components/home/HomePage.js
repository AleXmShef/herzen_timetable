import React, {Component} from 'react';
import {Container, Col, Row, Accordion, Card, Spinner} from "react-bootstrap";

import TimetableCard from "./TimetableCard";
import Resources from "./Resources";

import axios from 'axios';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: [
                "faculty",
                "type",
                "level",
                "program",
                "subprogram",
                "year",
                "group"
            ],
            arrays: [
                "faculties",
                "types",
                "levels",
                "programs",
                "subprograms",
                "years",
                "groups"
            ],
            headers: [
                "Факультеты/институты",
                "Тип образования",
                "Уровень образования",
                "Программы обучения",
                "Направления подготовки",
                "Года поступления",
                "Группы"
            ],
            selections: [-1],
            currentStage: 0,
            timetable: undefined
        }
        this.getTimetable = this.getTimetable.bind(this);
        this.manageStage = this.manageStage.bind(this);
    }

    componentDidMount() {
        this.getTimetable();
    }

    getTimetable() {
        axios.get('/api/timetable/all_cached').then((res) => {
            this.setState({
                timetable: res.data
            })
        }).catch((e) => {
            console.log(e);
        })
    }

    manageStage(senderStage, senderIndex) {
        let {currentStage, selections, timetable, arrays} = this.state;
        if(senderStage === 7) {
            let _data = timetable;
            console.log(selections);
            for(let j = 1; j < senderStage; j++) {
                _data = _data[arrays[j - 1]][selections[j]];
            }
            let group = _data[arrays[senderStage - 1]][senderIndex - 1];
            localStorage.setItem('group', JSON.stringify(group));
            localStorage.setItem('subgroup', '0');
            this.props.history.push('/timetable');
        }
        else if(currentStage < senderStage) {
            selections.push(senderIndex - 1);
            currentStage++;
            console.log("changing current stage to " + currentStage);
        }
        else if(currentStage === senderStage) {
            selections[currentStage] = senderIndex - 1;
        }
        else {
            for(let i = currentStage; i > senderStage; i--)
                selections.pop();
            currentStage = senderStage;
            selections[currentStage] = senderIndex - 1;
            console.log(currentStage);
        }
        this.setState({
            currentStage: currentStage,
            selections: selections
        })
    }

    composeSelection() {
        let output = 0;
        let {currentStage, selections, timetable, headers, arrays, stages} = this.state;
        if(timetable)
        for(let i = currentStage; i >= 0; i--) {
            let _data = timetable;
            for(let j = 1; j <= i; j++) {
                _data = _data[arrays[j - 1]][selections[j]];
            }
            if (_data && _data[arrays[i]]) {
                const children = output;
                output =
                    <React.Fragment>
                        <Card>
                            <Card.Header>
                                {headers[i]}
                            </Card.Header>
                        </Card>
                        {
                            _data[arrays[i]].map(item => {
                                const itemIndex = _data[arrays[i]].indexOf(item) + 1;
                                return (
                                    <TimetableCard
                                        header_name={item[stages[i]]}
                                        key={itemIndex} index={itemIndex}
                                        pushState={this.manageStage}
                                        stage={i + 1}
                                    >
                                        {
                                            (children && selections[i + 1] !== undefined &&
                                            selections[i + 1] === itemIndex - 1) ? children : undefined
                                        }
                                    </TimetableCard>
                                )
                            })
                        }
                    </React.Fragment>
            }
        }
        return output;
    }

    render() {
        let output = this.composeSelection();
        return (
            <Container style={{marginTop: 150}}>
                <Row className="justify-content-md-center">
                    <Col md style={{'marginBottom': 50}}>
                        <Accordion>
                            {(output !== 0) ? output :
                                <div className='d-flex justify-content-center'>
                                    <Spinner style={{margin: 8, justifyContent: 'center'}} animation='border' variant='primary'/>
                                </div>
                            }
                        </Accordion>
                    </Col>
                    <Col md style={{'marginBottom': 50}}>
                        <Resources/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

HomePage.propTypes = {

};

export default HomePage;
