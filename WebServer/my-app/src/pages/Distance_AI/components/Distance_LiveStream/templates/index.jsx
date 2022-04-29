import React, { Component } from 'react';
import "./styles.css";
import { Layout, Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const options = [
  { value: "0", label: "ALL CAMERAS" },
  { value: "1", label: "1st CAMERA" },
  { value: "2", label: "2nd CAMERA" },
];

class AllCameras extends Component {
  render() {
    return (
      <div>
        <img
          src="http://192.168.1.246:5004/video/0"
          alt="Capturing Device #0"
          width="500"
          height="400"
        />
        <img
          src="http://192.168.1.246:5004/video/1"
          alt="Capturing Device #1"
          width="500"
          height="400"
        />
      </div>
    );
  }
}

class FirstCamera extends Component {
  render() {
    return (
      <div>
        <img
          src="http://42.60.113.58:5004/video/0"
          alt="Capturing Device #0"
          width="500"
          height="400"
        />
      </div>
    );
  }
}

class SecondCamera extends Component {
  render() {
    return (
      <div>
        <img
          src="http://42.60.113.58:5004/video/1"
          alt="Capturing Device #1"
          width="500"
          height="400"
        />
      </div>
    );
  }
}

class LiveStream extends Component {
  constructor() {
    super();
    this.state = {
      title: 'ALL CAMERAS',
      selectedOption: '0'
    };
  }

  render() {
    const { Header, Content, Footer } = Layout;

    const handleChange = ({key}) =>
    {
      this.setState({ title: key })
    }

    const menu = (
      <Menu onClick={handleChange}>
        <Menu.Item key="ALL CAMERAS">
          ALL CAMERAS
        </Menu.Item>
        <Menu.Item key="Location #01 (Camera 01)">
          Location #01 (Camera 01)
        </Menu.Item>
        <Menu.Item key="Location #02 (Camera 02)">
          Location #02 (Camera 02)
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Content>
            <div className="container">
              <h1 id="livestream_title"> <u>{this.state.title}</u> </h1>
              <Dropdown
                overlay={menu}
                trigger={['click']}>
                <Button className="location-dropdown">
                  Location
                  <DownOutlined />
                </Button>
              </Dropdown>

              <div className="camera-container">
                {this.state.title === "ALL CAMERAS" ? (
                  <AllCameras/>
                ) : this.state.title === "Location #01 (Camera 01)" ? (
                  <FirstCamera />
                ) : this.state.title === "Location #02 (Camera 02)" ? (
                  <SecondCamera />
                ) : null}
              </div>

            </div>
        </Content>
      </>
    );
  }
}
export default LiveStream
