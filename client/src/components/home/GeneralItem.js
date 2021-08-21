import React, {Component} from "react";
import {Card, Spinner} from "react-bootstrap";
import TimetableCard from "./TimetableCard";
import axios from "axios";
import PropTypes from 'prop-types';

const stages = [
	"faculty",
	"type",
	"level",
	"year",
	"program",
	"subprogram",
	"group"
];
const arrays = [
	"faculties",
	"types",
	"levels",
	"years",
	"programs",
	"subprograms",
	"groups"
];
const headers = [
	"Факультеты/институты",
	"Тип образования",
	"Уровень образования",
	"Курс",
	"Программы обучения",
	"Направления подготовки",
	"Группы"
];

class GeneralItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: undefined,
			selected: -1,
			nextArgs: []
		};
		console.log("Activated stage " + this.props.stage);

		this.select = this.select.bind(this);
		this.dataProvider = this.dataProvider.bind(this);

	}
	componentDidMount() {
		this.dataProvider(this.props.prevArgs, this.props.stage).then(res => {
			this.setState({data: res.data[arrays[this.props.stage]]});
			console.log("fetched data for stage " + this.props.stage);
		});
	}

	select(index) {
		if(this.props.stage === 6) {
			localStorage.setItem('group', JSON.stringify(this.state.data[index]));
			localStorage.setItem('subgroup', '0');
			this.props.completeSelection();
		}
		let nextArgs = this.props.prevArgs;
		nextArgs.push(this.state.data[index]);
		this.setState({selected: index, nextArgs: nextArgs});
	}

	render() {
		return this.state.data !== undefined ? <React.Fragment>
			<Card>
				<Card.Header>
					{headers[this.props.stage]}
				</Card.Header>
			</Card>
			{
				this.state.data.map(item => {
					const itemIndex = this.state.data.indexOf(item);
					return (
						<TimetableCard
							header_name={item[stages[this.props.stage]]}
							key={itemIndex} index={itemIndex}
							pushState={this.select}
						>
							{
								(this.state.selected === itemIndex) ?
									<GeneralItem stage={this.props.stage + 1} prevArgs={this.state.nextArgs} previous={this} completeSelection={this.props.completeSelection}/> : undefined
							}
						</TimetableCard>
					)
				})
			}
		</React.Fragment> : <div className='d-flex justify-content-center'>
			<Spinner style={{margin: 8, justifyContent: 'center'}} animation='border' variant='primary'/>
		</div>
	}

	async dataProvider(args_raw, stage) {
		if(stage < 5) {
			let data = {};
			args_raw.forEach(arg => {
				const index = args_raw.indexOf(arg);
				Object.defineProperty(data, stages[index], {value: arg[stages[index]], writable: true, enumerable: true});
			})
			return await axios.get(`/api/timetable/${arrays[stage]}`, {params: data});
		}
		else {
			return  {data: this.props.previous.state.data.find(thing => {
				return thing[stages[stage - 1]] === args_raw[args_raw.length - 1][stages[stage - 1]];
			})};
		}
	}
}

GeneralItem.propTypes = {
	prevArgs: PropTypes.array.isRequired,
	stage: PropTypes.number.isRequired,
	previous: PropTypes.object,
	completeSelection: PropTypes.func
};

export default GeneralItem;