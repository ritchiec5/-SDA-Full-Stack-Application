import React, { Component } from 'react';
import moment from 'moment';
import "./styles.css";
import { Layout } from 'antd';
import { Row, Col } from 'antd';
import DonutChart from './components/DonutChart'
import ColumnChart from './components/ColumnChart';
import LineChart from './components/LineChart';

const { Content } = Layout;

const baseURL = 'https://localhost:5001/DistanceVideo';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      TodaySD_data: 5,
      TodayDB_data: 10,
      WeekSD_data: [3, 4, 3.5, 5, 4.9, 5, 2],
      WeekDB_data: [3, 4, 3.5, 5, 4.9, 5, 2],
      MonthSD_data: [3, 4, 3.5, 5, 4.9, 6, 7, 9, 13, 8, 6, 6],
      MonthDB_data: [3, 4, 3.5, 5, 4.9, 6, 7, 9, 13, 8, 6, 6],
    };
  }

  componentDidMount() {
    /* Get Todays date*/
    var today = moment().format('DD-MM-YYYY'); 
    
    fetch(baseURL)
      .then((response) => {
        console.log('response', response);

        if (!response.ok) {
          throw Error('Error Fetching Video');
        }
        return response
          .json()
          .then((allData) => {

            allData.forEach((data) => {
              console.log(data);
              /* Statistics for Today SD and DB */
              if (data.dateCreated == today) {
                if (data.violation == 'SD') {
                  this.setState({ TodaySD_data: this.state.TodaySD_data + 1 });
                } else if (data.violation == 'DB') {
                  this.setState({ TodayDB_data: this.state.TodayDB_data + 1 });
                }
              }

              /* Statistics for This Week SD and DB*/
              let start_of_week = moment().startOf('week').format('YYYY-MM-DD');
              let dateCreated = moment(data.dateCreated, 'DD-MM-YYYY').format('YYYY-MM-DD');
              
              /* Check data is within the current week */
              if (
                moment(dateCreated).isSame(start_of_week) ||
                moment(dateCreated).isAfter(start_of_week)
              ) {
                /* Checks day of the week */
                dateCreated = moment(dateCreated);
                start_of_week = moment(start_of_week);
                let diff = dateCreated.diff(start_of_week, 'days');

                if (data.violation == 'SD') {
                  let WeekSD_data = this.state.WeekSD_data;
                  WeekSD_data[diff] = WeekSD_data[diff] + 1;
                  this.setState({ WeekSD_data: WeekSD_data });
                } else if (data.violation == 'DB') {
                  let WeekDB_data = this.state.WeekDB_data;
                  WeekDB_data[diff] = WeekDB_data[diff] + 1;
                  this.setState({ WeekDB_data: WeekDB_data });
                }
              }

              /* Statistics for Month SD and DB*/
              let month_created = moment(data.dateCreated, 'DD-MM-YYYY').format('MM');
              month_created = Number(month_created);
              if (data.violation == 'SD') {
                let MonthSD_data = this.state.MonthSD_data;
                MonthSD_data[month_created - 1] = MonthSD_data[month_created - 1] + 1;
                this.setState({ MonthSD_data: MonthSD_data });
              } else if (data.violation == 'DB') {
                let MonthDB_data = this.state.MonthDB_data;
                MonthDB_data[month_created - 1] = MonthDB_data[month_created - 1] + 1;
                this.setState({ MonthDB_data: MonthDB_data });
              }
            });
          })
          .catch((err) => {
            throw Error(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
      });

  }

  render() {
    return (
      <>
        <Content>
          <Row gutter={0}>
            <Col className="gutter-row" span={10}>
              <div className="left-containter">
                <div className="diagram-container">
                  <div className="container-title" id="safedistancing_linechart">
                    Safe Distancing Violation This Week
                  </div>
                  <LineChart color={'#AB91C4'} line_data={this.state.WeekSD_data} />
                </div>
                <div className="diagram-container">
                  <div className="container-title" id="safedistancing_columnchart">
                    Safe Distancing Violation Every Month
                  </div>
                  <ColumnChart column_data={this.state.MonthSD_data} />
                </div>
              </div>
            </Col>

            <Col className="gutter-row" span={10}>
              <div className="middle-containter">
                <div className="diagram-container">
                  <div className="container-title" id="dangerousbehavior_linechart">
                    Dangerous Behavior This Week
                  </div>
                  <LineChart color={'#80A0D6'} line_data={this.state.WeekDB_data} />
                </div>
                <div className="diagram-container">
                  <div className="container-title" id="dangerousbehavior_columnchart">
                    Dangerous Behavior Every Month
                  </div>
                  <ColumnChart column_data={this.state.MonthDB_data} />
                </div>
              </div>
            </Col>

            <Col className="gutter-row" span={4}>
              <div className="right-containter">
                <div className="small-container">
                  <div className="container-title">Violation Today</div>
                  <div className="donut-container" id="donutchart">
                    <DonutChart
                      TodayDB_data={this.state.TodayDB_data}
                      TodaySD_data={this.state.TodaySD_data}
                    />
                  </div>
                </div>
                <div className="red-number-container">
                  <div className="number-container-title">Safe Distancing Violation Today</div>
                  <h1 className="h1-text" id="safedistancing_text">
                    {' '}
                    {this.state.TodaySD_data}{' '}
                  </h1>
                </div>
                <div className="orange-number-container">
                  <div className="number-container-title">Dangerous Behavior Today</div>
                  <h1 className="h1-text" id="dangerousbehavior_text">
                    {' '}
                    {this.state.TodayDB_data}{' '}
                  </h1>
                </div>
              </div>
            </Col>
          </Row>
        </Content>
      </>
    );
  }
}

export default Dashboard