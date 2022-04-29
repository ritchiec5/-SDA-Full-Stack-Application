import React, { Component } from 'react';
import "./styles.css";
import { Layout } from 'antd';

// This script for debugging purpose.
// It is to test the connection of the capturing device.
class AllCameras extends Component {
  render() {
    return (
      <div>
        <img
          src="http://42.60.113.58:5003/video/0"
          alt="Capturing Device #0"
          width="500"
          height="400"
        />
        <img
          src="http://42.60.113.58:5003/video/1"
          alt="Capturing Device #1"
          width="500"
          height="400"
        />
      </div>
    );
  }
}
class LiveStream extends Component {

  render() {
    const { Header, Content, Footer } = Layout;

    return (
      <>
        <Content>
            <div className="container">
              <AllCameras/>
            </div>
        </Content>
      </>
    );
  }
}
export default LiveStream
