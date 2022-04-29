import React, { Component } from 'react';
import "./styles.css";
import ProCard from '@ant-design/pro-card';
import Dashboard from './components/Distance_Dashboard';
import DistanceVideo from './components/Distance_Video';
import LiveStream from './components/Distance_LiveStream/templates';

class Distance_AI extends Component {

  
  render() {
    return (
      <>
        <ProCard tabs={{ type: 'card' }}>
          <ProCard.TabPane key="tab1" tab="LiveStream">
            <LiveStream />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="Distance Video">
            <DistanceVideo />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="Dashboard">
            <Dashboard />
          </ProCard.TabPane>
        </ProCard>
      </>
    );
  }
}

export default Distance_AI;