import React, {Component} from 'react';
import {Container, Spinner} from "react-bootstrap";
import axios from 'axios';

import DayCard from "./DayCard";
import Overhead from "./Overhead";

const Months = [
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
];

class TimetablePage extends Component {
	myRef = React.createRef();
	constructor(props) {
		super(props);
		let group = localStorage.getItem('group');
		let subgroup = 0;
		let shouldRender = true;
		if(!group) {
			shouldRender = false;
		}
		else {
			group = JSON.parse(group);
			subgroup = localStorage.getItem('subgroup');
			if(!subgroup)
				subgroup = 0;
			else
				subgroup = Number(subgroup);
		}
		this.state = {
			days: [
				"понедельник",
				"вторник",
				"среда",
				"четверг",
				"пятница",
				"суббота",
				"воскресенье"
			],
			shouldRender: shouldRender,
			group: group,
			subgroup: subgroup,
			timetable: {},
			currentDate: 0,
			currentDateMil: Date.now(),
			currentWeekBegin: {},
			currentWeekBeginMil: 0,
			currentWeekEnd: {},
			currentWeekEndMil: 0,
			isOddWeek: 0
		}
		this.changeWeek = this.changeWeek.bind(this);
		this.changeSubgroup = this.changeSubgroup.bind(this);
		this.executeScroll = this.executeScroll.bind(this);
	}

	componentDidMount() {

		if(this.state.shouldRender) {
			this.parseDates();

			let _timetable = localStorage.getItem('localTimetable');

			if(_timetable)
				this.setState({timetable: JSON.parse(_timetable)});

			let link = this.state.group.link;

			axios.get('/api/timetable/group', {
				params: {
					groupURL: link
				}
			}).then((res) => {
				console.log(res.data);
				localStorage.setItem('localTimetable', JSON.stringify(res.data));
				this.setState({timetable: res.data, group: {group: this.state.group.group, link: link}});
			}).catch((err) => {
				console.log("failed to connect to server, using local copy");
			})
		}
		else
			this.props.history.push('/');

	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.executeScroll()
	}

	changeSubgroup(subgroup) {
		if(this.state.subgroups !== subgroup - 1) {
			localStorage.setItem('subgroup', (subgroup - 1).toString());
			this.setState({subgroup: subgroup - 1});
		}
	}

	parseDates() {
		let currentDateMil = new Date(this.state.currentDateMil);
		const currentDate = new Date(currentDateMil.getFullYear(), currentDateMil.getMonth(), currentDateMil.getDate());
		currentDateMil = currentDate.getTime();

		let currentYear = currentDate.getFullYear();
		if(currentDate.getMonth() < 8)
			currentYear--;
		let firstSeptember = new Date(currentYear, 8, 1);
		let firstSeptemberMil = firstSeptember.getTime();

		for(let i = firstSeptember.getDay(); i > 1; i--)
			firstSeptemberMil-= 24 * 60 * 60 * 1000;

		let yearWeekBegin = new Date(firstSeptemberMil);

		let currentWeekBeginMil = currentDateMil - 24 * 60 * 60 * 1000 * (currentDate.getDay() - 1);
		let currentWeekBegin = new Date(currentWeekBeginMil);

		const isOdd = this.isOddWeek(yearWeekBegin.getTime(), currentWeekBegin.getTime());

		let currentWeekEndMil = currentWeekBeginMil + 6 * 24 * 60 * 60 * 1000;
		let currentWeekEnd = new Date(currentWeekEndMil);

		this.setState ({
			currentDate: currentDate,
			currentDateMil: currentDate.getTime(),
			currentWeekBegin: currentWeekBegin,
			currentWeekBeginMil: currentWeekBeginMil,
			currentWeekEnd: currentWeekEnd,
			currentWeekEndMil: currentWeekEndMil,
			isOddWeek: isOdd
		});
	}

	isOddWeek(start, check) {
		let begin = start;
		let isOdd = 0;
		while(begin < check) {
			begin += 7 * 24 * 60 * 60 * 1000;
			if(isOdd === 1)
				isOdd = 0;
			else
				isOdd = 1;
		}
		return isOdd;
	}

	changeWeek(action) {
		if(action === "advance") {
			let newDate = this.state.currentDateMil + 7 * 24 * 60 * 60 * 1000;
			this.setState({currentDateMil: newDate}, () => {this.parseDates()});
		}
		if(action === "impede") {
			let newDate = this.state.currentDateMil - 7 * 24 * 60 * 60 * 1000;
			this.setState({currentDateMil: newDate}, () => {this.parseDates()});
		}

	}

	executeScroll = () => {
		let curMil = Date.now();
		if(this.myRef.current && this.state.currentWeekBeginMil < curMil && curMil < this.state.currentWeekEndMil)
			this.myRef.current.scrollIntoView({
				block: "center",
				behavior: "smooth"
			});
	}

	render() {
		let {shouldRender, timetable, group, subgroup} = this.state;
		return shouldRender && (

			<Container className="justify-content-md-center" style={{marginTop: 150}}>
				<Overhead
					isOddWeek={this.state.isOddWeek}
					weekBegin={this.state.currentWeekBegin}
					weekEnd={this.state.currentWeekEnd}
					months={Months}
					changeWeek={this.changeWeek}
					groupName={group.group}
					activeSubgroup={subgroup}
					changeSubgroup={this.changeSubgroup}
					subgroupsNumber={(timetable.subgroups) ? timetable.subgroups.length : 1}
				/>
				{( timetable.subgroups && timetable.subgroups[subgroup] && timetable.subgroups[subgroup].days) ? timetable.subgroups[subgroup].days.map(day => {
						const dayDateMil =
							this.state.currentWeekBeginMil +
							this.state.days.indexOf(day.day) *
							24*60*60*1000;

						const dayDate = new Date(dayDateMil);
						let isCurrent = dayDateMil === this.state.currentDateMil;

						return <div ref={isCurrent ? this.myRef : null}>
							<DayCard
								key={day.day}
								day={day}
								isCurrent = {isCurrent}
								isOddWeek={this.state.isOddWeek}
								currentDateMil={dayDateMil}
								currentDate={dayDate}
								months={Months}
							/>
						</div>
					}) :
					<div className='d-flex justify-content-center' style={{marginBottom: 2000}}>
						<Spinner animation='border' variant='primary'/>
					</div>}
			</Container>
		)
	}
}

TimetablePage.propTypes = {};

export default TimetablePage;
