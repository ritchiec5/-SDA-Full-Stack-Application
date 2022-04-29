import React, {useState} from "react";
import Video from "./Video";
import './styles.css';
import moment from 'moment';

const VideoContainer = props => {
    
    const displayVideo = () => {
        let Tag = [];
        let i = 1;
        let video_timing = {
            video_date: [],
            video_time: []
        }
        
        /* 
        Feature: Similarity Feature 
        Functionality: Check video are within 30sec of each other
        Implementation: 
            1. Initialize tags display as "none"
            2. Loop through array comparing time created of video
            3. If videos are within 30sec change tags display to "block" 
        */
        props.videos.forEach(videos => {
            if (videos.video.includes("AI_Video") ) {
                Tag[i-1] = "none";
                video_timing.video_date[i - 1] = moment(videos.dateCreated, 'DD-MM-YYYY').format('YYYY-MM-DD');
                video_timing.video_time[i-1] = videos.timeCreated;
                if (i > 1){
                    for( let j = i; j > 1 ; j--){
                        /* Check Video occur on the same date */
                        if (videos.timeCreated != "null" && moment(video_timing.video_date[i - 1]).isSame(video_timing.video_date[j - 2])){
                            
                            /* Check Videos occur within 30sec of each other*/
                            let date1 = moment(video_timing.video_time[i - 1], 'hh:mm:ss');
                            let date2 = moment(video_timing.video_time[j - 2], 'hh:mm:ss');
                            let diff = moment.duration(date1.diff(date2, 'seconds'));
                            if (Math.abs(diff) <= 30){
                                /* 
                                Similarity Tag  
                                - Initial Tag display = "none"
                                - Tag display = "block" will display the tag
                                */
                                Tag[i-1] = "block";
                                Tag[j-2] = "block";
                            }
                        }
                    }
                }
                i++;
            }
        });

        /* Create Video Component for each video */
        i = 1;
        return props.videos.map(videos => {
            let video_title = "";
            let video_date = moment(videos.dateCreated, 'DD-MM-YYYY').locale('en').format('Do MMM YYYY');

            /* Checks Filepath provided by the Database */
            if (videos.video.includes("AI_Video")){  
                
                /* Formats the Video Title */              
                if (i < 10){video_title = "Video #000" + i.toString();}
                else if (i < 100) {video_title = "Video #00" + i.toString();}
                else if (i < 1000) { video_title = "Video #0" + i.toString();}
                else { video_title = "Video #" + i.toString();}
                i++;
                return <Video videos={videos} video_title={video_title} video_date={video_date} video_tag={Tag[i-2]}/>;
            }
        });
    };
    
    return (
        <section>{displayVideo()}</section>
    );

};

export default VideoContainer;