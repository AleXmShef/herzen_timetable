import React, {Component} from 'react';
import {Container, Col, Row, Accordion, Card, Button, Spinner} from "react-bootstrap";
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

import TimetableCard from "./TimetableCard";
import Resources from "./Resources";

import axios from 'axios';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stageEnum: {
                facultySelection: 0,
                typeSelection: 1,
                levelSelection: 2,
                programSelection: 3,
                subprogramSelection: 4,
                yearSelection: 5,
                groupSelection: 6
            },
            stages: [
                "faculty",
                "type",
                "level",
                "program",
                "subprogram",
                "year",
                "group"
            ],
            requests: [
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
            currentStage: -1,
            stagesData: []
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData(0, undefined, undefined);
    }

    getData(stage, sender, name, e) {
        if(this.state.currentStage < stage) {
            if (stage >= 0 && stage <= 2) {
                let params = {};
                if(stage > 1)
                    params = {
                        [this.state.stages[this.state.currentStage - 1]]: this.state.stagesData[this.state.currentStage].holderName,
                        [this.state.stages[this.state.currentStage]]: name
                    }
                else if(stage > 0)
                    params = {
                        [this.state.stages[this.state.currentStage]]: name
                    }
                axios.get('/api/timetable/' + this.state.requests[stage], {
                    params: params
                }).then((res) => {
                    let stagesData = this.state.stagesData;
                    console.log(res.data);
                    stagesData.push({
                        data: res.data[this.state.requests[stage]],
                        holder: sender,
                        holderName: name
                    });
                    this.setState({stagesData: stagesData, currentStage: stage}, () => {
                        console.log("Stage changed to: " + this.state.currentStage);
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }
            else if(stage === 3) {
                axios.get('/api/timetable/' + 'programs', {
                    params: {
                        [this.state.stages[this.state.currentStage - 1]]: this.state.stagesData[this.state.currentStage].holderName,
                        [this.state.stages[this.state.currentStage]]: name,
                        [this.state.stages[this.state.currentStage - 2]]: this.state.stagesData[this.state.currentStage - 1].holderName
                    }
                }).then((res) => {
                    let stagesData = this.state.stagesData;
                    console.log(res.data);
                    stagesData.push({
                        data: res.data[this.state.requests[stage]],
                        holder: sender,
                        holderName: name
                    });
                    this.setState({stagesData: stagesData, currentStage: stage}, () => {
                        console.log("Stage changed to: " + this.state.currentStage);
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }
            else if (stage < 7) {
                let temp = [];
                let stagesData = this.state.stagesData;
                stagesData[stage - 1].data.forEach(element => {
                    console.log(element);
                    temp.push(element[this.state.requests[stage]]);
                })
                console.log(temp);
                stagesData.push({
                    data: temp[0],
                    holder: sender,
                    holderName: name
                });
                console.log(stagesData);
                this.setState({stagesData: stagesData, currentStage: stage});
            }
            else {
                let group = this.state.stagesData[stage - 1].data[sender-1];
                localStorage.setItem('group', JSON.stringify(group));
                this.props.history.push('/timetable');
            }
        }
        else if(this.state.currentStage === stage) {
            let stagesData = this.state.stagesData;
            stagesData.pop();
            this.setState({stagesData: stagesData, currentStage: stage - 1}, () => {
                this.getData(stage, sender, name, e);
            });
        }
        else {
            let stagesData = this.state.stagesData;
            for(let i = this.state.currentStage; i >= stage; i--) {
                stagesData.pop();
            }
            this.setState({stagesData: stagesData, currentStage: stage - 1}, () => {
                this.getData(stage, sender, name, e);
            });
        }
    }

    render() {
        const currentStage = this.state.currentStage;
        const stageEnum = this.state.stageEnum;
        let output = 0;
        for(let i = this.state.currentStage; i >= 0; i--) {
            if (this.state.stagesData[i]) {
                const temp = output;
                output =
                <React.Fragment>
                    <Card>
                        <Card.Header>
                            {this.state.headers[i]}
                        </Card.Header>
                    </Card>
                    {
                        this.state.stagesData[i].data.map(item => {
                            const itemIndex = this.state.stagesData[i].data.indexOf(item) + 1;
                            return (
                                <TimetableCard children={temp} header_name={item[this.state.stages[i]]} key={itemIndex} index={itemIndex} func_advance={this.getData} stage={i + 1}>
                                    {(temp !== 0 && this.state.stagesData[i + 1] && (this.state.stagesData[i + 1].holder === itemIndex)) ?  temp : undefined}
                                </TimetableCard>
                            )
                        })
                    }
                </React.Fragment>
            }
        }
        console.log(output);
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
