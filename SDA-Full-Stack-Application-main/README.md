# 2021-TEAM-21

## Architecture 
![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/Architecture.JPG)

## Functionalities

### Overall Functionalities

The overall Functionalities of the Software: 

![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/Overall_Functionalities.JPG)

***

### AI & Flask (Functionalities)
* AI and Flask have implemented multithreading (using Flask), creating a thread per camera. 
* Each thread consists of an AI and safe distancing algorithm, which will send data to Netcore accordingly while providing a live stream feed to the interface.
* In the event of a violation, an audio alert would be played and an email of the violation would be sent simultaneously to the intended receipients.

* **AI & SDA Algorithm functionality**:
 1. Detects Safe Distancing
 2. Detects Dangerous behavior (Worker to close to vehicle<Car>
 3. Provides Distance the distance
 4. Configure Safe Distancing 

**Violation detection**
1. Human to Human
 
  ![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/human-to-human.png)
 
2. Human to Car
 
  ![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/human-to-car.png)
***

### Netcore & PostgreSQL (Functionalities)
* The Netcore components consist of the REST API with four operations: Get (Get & GetAll), Post, Put, Delete (Delete Video from Database).
 1. GetALL: Get all data from Database
 2. Get: Get specific data from Database
 3. Post: Insert data into Database
 4. Put: Update data in Database
 5. Delete: Delete data in Database and Deletes the Video stored
 
**Web API** 
 
![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/NetCore.JPG)
 
**Data Schema**
 
![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/Data_Schema.JPG)


***

### Interface (Functionalities) 
* The interface component consists of three different pages: live-streaming page, Capture Page, and AI dashboard page. 

**Capture Page**
* The capture page and AI dashboard page will display information based on the results of the GET request to the Netcore. 
* The capture page consists of three features: delete, download, and error checking. 
  1. Delete: Sends Delete Request to Netcore to delete video from database.
  2. Download: Downloads the video.
  3. Similarity: Tag to show that the video are taken within similar time frame. 

  ![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/Progress%20Report%203/Demo6.JPG)

**Dashboard Page** (Functionalities)
* The dashboard pages provides the statistics:
 1. Violation occurring today
 2. Violation in a week
 3. Violation occuring every month

![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/Progress%20Report%203/Demo7.JPG)


**Live-Streaming page** (Functionalities)
* Provides Live Stream of Camera feed
* Dropdown feature: For all or specific cameras
  
![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/Progress%20Report%203/Demo4.JPG) 


**Notifcation Feature** (Functionalities)
* Notification Bell Icon to notify new violation that occur
![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/Progress%20Report%204/Demo6.png)

## Set up and Configuration
* **Netcore**: Click on Netcore Folder for Readme on Setup and Installation guide, Configuration and Testing.
* **React**: Click on React Folder for Readme on Setup and Installation guide, Configuration and Testing.
