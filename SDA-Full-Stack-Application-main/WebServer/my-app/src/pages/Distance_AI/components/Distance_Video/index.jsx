import React, { Component } from 'react';
import './styles.css';
import { fetch } from 'dva';
import { Typography } from 'antd';
import VideoContainer from './components/VideoContainer'

const { Title } = Typography;

const baseURL = 'https://localhost:5001/DistanceVideo';

class DistanceVideo extends Component {
  constructor() {
    super();
    this.state = {
      videos: []
    };
  }

  componentDidMount(){
    /* Fetch Data from database */
      fetch(baseURL)
        .then(response => {
          console.log('response', response);
          return response.json()
            .then(allData => {
              this.setState({ videos: allData });
              console.log(allData);
            })
            .catch(err => {
              console.log(err);
            });
        }
        ).catch(err => {console.log(err)});
  }

  render(){
    return (
      <div className="logo" id="logos">
        <Title style={{ marginLeft: '2vw', marginTop: '1vh', fontFamily: 'Merriweather' }}>
          <u id="page_title">List of Videos</u>
        </Title>
        <VideoContainer videos={this.state.videos} />
      </div>
    );
  }

}

export default DistanceVideo;