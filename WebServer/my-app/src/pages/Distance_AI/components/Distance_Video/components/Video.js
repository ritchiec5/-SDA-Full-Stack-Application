import React, { useState } from 'react';
import {Modal, Button } from 'antd';
import './styles.css';
import { Typography } from 'antd';
import { Tag } from 'antd';
import {ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const baseURL = 'https://localhost:5001/DistanceVideo';

const Video = props => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoID, setvideoID] = useState(baseURL + "/" + props.videos.id);
    const [isContainerVisible, setisContainerVisible] = useState('block');
    const [isTagVisible, setisTagVisible] = useState(props.video_tag);

    console.log(baseURL + "/" + props.videos.id);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const updatepost = () => {
        fetch(videoID, {
            method: 'PUT', 
            mode: 'cors', 
            credentials: 'same-origin',         
            headers: {
                'Content-Type': 'application/json'
            }, 
            redirect:'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({ 
                video: props.videos.video, 
                camera: props.videos.camera, 
                duration: props.videos.duration, 
                violation: props.videos.violation, 
                dateCreated: props.videos.dateCreated, 
                timeCreated: "null"
            })}).then( response => console.log(response));
        
    }

    const deletepost = () => {
        fetch(videoID, { method: 'DELETE', mode: 'cors', credentials: 'same-origin'}).then( response => console.log(response));
        setisContainerVisible('none');
        setIsModalVisible(false);
    };

        return (
            <>
            <div>
            <div className="Video_Container" style={{display: isContainerVisible}}>
                <video className="AI_Videos" preload="metadata" onClick={() => showModal()}>
                    <source src={props.videos.video} type="video/mp4" />
                </video>
                <div className="Video_Tag"><p className="Video_Tag_text"><b>{props.videos.duration} </b></p></div>
                <h1>{props.video_title} || Camera #{props.videos.camera}</h1>
                <p style={{marginBottom: "1vh", marginTop: "-1vh"}}>{props.video_date}</p>
                <div style={{display: isTagVisible}}>
                <Tag className='Warning_Tag' icon={<ExclamationCircleOutlined />} color="warning" onClose={updatepost} style={{ minwidth: "4.5vw", position: "absolute", top: "4px", right: "5px", marginRight: "0px"}} closable>
                    Similar
                </Tag>
                </div>
            </div>
    
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                centered
                footer={null}
                >
                <div>
                    <Title style={{ marginLeft: '3vw' }}>{props.video_title}</Title>
                </div>
                <div className="Modal1">
                    <video controls className="AI_Videos1">
                        <source src={props.videos.video} type="video/mp4" />
                    </video>
                </div>
                <div className="Modal2">
                    <Button type="primary" className="Modal_Button" style={{ marginRight: '2vw' }}>
                        <a href={props.videos.video} download>Download</a>
                    </Button>
                    <Button type="primary" danger className="Modal_Button" onClick={deletepost} style={{ marginRight: '3vw' }}>
                        Delete
                    </Button>
                </div>
            </Modal>
            </div>
            </>
            
        );
    }

export default Video