from base64 import b64encode
from turtle import position
from PIL import Image
from requests.api import request
from tqdm import tqdm
import cv2
import numpy as np
import os
import torch
import pandas
import seaborn as sn
import torchvision
import PIL
from PIL import Image
import datetime
import requests
import base64
import time
import sys
from alertviolation import Alert

# Read parameters from external config file
config = eval(open("../../external.config").read())
MAX_GROUPSIZE = config['MAX_GROUPSIZE'] # Configure MAX Group Size of people
OBJECT_CONFIDENCE = config['OBJECT_CONFIDENCE'] # Confidence level for AI to detect Object
SAFE_DISTANCE = config['SAFE_DISTANCE'] # Minimum Distance of Humans to be considered a Violation
CRANE_DISTANCE = config['CRANE_DISTANCE'] # Minimum Distance of Crane to be considered a Violation
AI_Model = config['AI_Model']

PREV_TIME = 0 # Sets FPS at 0

class distance_based_AI():
    """
    Class for Distance AI
    ...

    Methods
    -------
    get_duration(path)
        Gets the video duration from the file path

    distance_Violate_Euclidean(xyxy1, xyxy2):
        Calculates euclidean distance between 2 objects from the x & y coordinates

    detect_violations_on_frame(img, confidence, people_Dist, vehicle_Dist)
        Takes each image and use the AI to analyze for any safety violations that occur
    
    social_distance_Webcam(confidence, people_Dist, vehicle_Dist)
        Uses a external webcam to test the AI model
    """

    classes = ["person","","car"]
    global MAX_GROUPSIZE

    # Initialize model
    # model = torch.hub.load('ultralytics/yolov5', 'custom', path='firefly.pt',force_reload=True) #Select Model from YOLOv5 Repo
    # model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True, verbose=False) #Select Pretrained Model
    try:
        model = torch.hub.load('.', 'custom', path= AI_Model, source='local',force_reload=True) #Select Model Locally
    except:
        raise Exception("Model Checkpoint file not found.")

    try:
        model.cuda('cuda:0') #Check if GPU parallel enabled
    except:
        print("GPU not enabled; using default graphics.")

    def get_duration(self, path):
        """
        This function takes in the filepath of a video, calculates the duration and return it in minutes:seconds.
        
        Parameters
        ----------
        path : str
            Gets the file path for the MP4 videos just created
        
        Returns
        -------
        (minutes, seconds) : str
        """
        data = cv2.VideoCapture(path)

        # count the number of frames
        frames = data.get(cv2.CAP_PROP_FRAME_COUNT)
        fps = data.get(cv2.CAP_PROP_FPS)

        print("frames", frames)
        print("fps", fps)

        duration = frames/fps
        minutes = int(duration/60)
        seconds = duration%60

        return "%01i:%02i" % (minutes, seconds)

    def distance_Violate_Euclidean(self, xyxy1, xyxy2): # Calculate Euclidean Distance of the bounding box centers
        """
        This function takes in the coordinates of 2 objects in a frame and calculates the euclidean dstance between them.

        Parameters
        ----------
        xyxy1 : list
            First coordinates of the object in xyxy format
            
        xyxy2 : list
            Second coordinates of the object in xyxy format

        Returns
        -------
        dist : str
        xyxy1center_x1 : int
        xyxy1center_y1 : int
        xyxy2center_x2 : int
        xyxy2center_y2 : int
        """
        pt1a, pt1b, pt1c, pt1d, _, t1 = xyxy1
        xyxy1center_x1 = (int(pt1a)+int(pt1c))//2
        xyxy1center_y1 = (int(pt1b)+int(pt1d))//2

        pt2a, pt2b, pt2c, pt2d, _, t2 = xyxy2
        xyxy2center_x2 = (int(pt2a)+int(pt2c))//2
        xyxy2center_y2 = (int(pt2b)+int(pt2d))//2

        dist = ((xyxy2center_x2-xyxy1center_x1)**2 + (xyxy2center_y2-xyxy1center_y1)**2)**0.5

        if (t1 == 2 and t2 == 0):
            return dist, xyxy1center_x1, xyxy1center_y1, xyxy2center_x2, xyxy2center_y2, 1 # Returns Dangerous Behaviour detected
        elif ((t1 == 0 and t2 == 0) or (t2 == 0 and t1 == 0)):
            return dist, xyxy1center_x1, xyxy1center_y1, xyxy2center_x2, xyxy2center_y2, 2 # Returns Social Distance Violation detected
        else:
            return dist, xyxy1center_x1, xyxy1center_y1, xyxy2center_x2, xyxy2center_y2, 0 # No Violations found

    def detect_violations_on_frame(self, img, confidence, people_Dist, vehicle_Dist):
        """
        Runs the AI object detection per frame on livestream.

        Parameters
        ----------
        img : list
            Image in byte array format
                
        confidence : float
            The confidence value for the AI
        
        people_Dist : int
            Distance to be considered a violation between worker-worker

        vehicle_Dist : int
            Distance to be considered a violation between worker-car

        Returns
        -------
        img : str
        danger_Count+social_Count : int
        danger_Count : int
        social_Count : int
        """
        global PREV_TIME
        curTime = time.time()
        try:
            fps = 1/(curTime - PREV_TIME)
        except:
            fps = 0
        PREV_TIME = curTime

        cv2.putText(img, f'FPS: {int(fps)}', (530, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0),3) # Display FPS

        danger_Count = 0
        social_Count = 0

        try:
          results = self.model([img[:, :, ::-1]])  # Pass the frame through the model and get the boxes
        except:
          raise Exception("No Camera Found or Camera Loading...")

        xyxy = results.xyxy[0].cpu().numpy()  # xyxy are the box coordinates

        xyxy = xyxy[xyxy[:, 4] >= confidence]  # Filter desired confidence
        xyxy = xyxy[np.logical_or(xyxy[:, 5] == 0, xyxy[:, 5] == 2)]  # Consider only people
        xyxyclass = xyxy

        colors = ['green']*len(xyxy)
        violations = ['false']*len(xyxy)
        for i in range(len(xyxy)):
            groupsize = 1
            violation_Idx = []
            position_Idx = []
            for j in range(i+1, len(xyxy)):
                # Calculate distance of the centers
                dist, x1, y1, x2, y2, type = self.distance_Violate_Euclidean(xyxy[i], xyxy[j])

                if (dist < vehicle_Dist and type == 1): #If dangerous behaviour spotted, show Yellow line
                    danger_Count += 1
                    colors[i] = 'yellow'
                    colors[j] = 'yellow'
                    img = cv2.line(img, (int(x1), int(y1)), (int(x2), int(y2)), (0,204,255), 2)
                    img = cv2.putText(img, str(int(dist)), (int((x1+x2)/2), int((y1+y2)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)


                if (dist < people_Dist and type == 2): #If Social Distance Violation spotted, show Red line
                    groupsize += 1
                    violation_Idx.append(j)
                    position_Idx.append([x1, y1, x2, y2])
                    if groupsize > MAX_GROUPSIZE:
                        colors[i] = 'red'  #Only highlight Violated people in red to reduce color confusion
                        violations[j] = 'true' #Flag Object as violation
                        for k in violation_Idx:
                            colors[k] = 'red'

                        for x1, y1, x2, y2 in position_Idx:
                            img = cv2.line(img, (int(x1), int(y1)), (int(x2), int(y2)), (0,0,255), 2)
                            img = cv2.putText(img, str(int(dist)), (int((x1+x2)/2), int((y1+y2)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)

                    if (colors[j] == 'red') or (colors[i] == 'red'):
                        img = cv2.putText(img, str(int(dist)), (int((x1+x2)/2), int((y1+y2)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
                        img = cv2.line(img, (int(x1), int(y1)), (int(x2), int(y2)), (0,0,255), 2)
                    else:
                        img = cv2.putText(img, str(int(dist)), (int((x1+x2)/2), int((y1+y2)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
                        img = cv2.line(img, (int(x1), int(y1)), (int(x2), int(y2)), (0,255,0), 2)

        for i, (x1, y1, x2, y2, _, c) in enumerate(xyxyclass): # Draws bounding boxes on each object identified per class.
            if colors[i] == 'green':
                color = (0, 255, 0)
            elif colors[i] == 'yellow':
                color = (0,204,255)
            else:
                color = (0, 0, 255)
            img = cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
            img = cv2.putText(img, self.classes[int(c)], (int(x1), int(y1)-5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        for i in violations:
            if i == 'true':
                social_Count+=1

        img = cv2.putText(img, 'Maximum Groupsize: {}'.format(MAX_GROUPSIZE), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0),2)
        img = cv2.putText(img, 'Dangerous Behaviours: {}'.format(danger_Count), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,204,255), 2)
        img = cv2.putText(img, 'Social Distance violations: {}'.format(social_Count), (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        img = cv2.putText(img, 'Total violations: {}'.format(social_Count+danger_Count), (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

        # Alert().sound_alert(danger_Count+social_Count, danger_Count, social_Count)

        return img, danger_Count+social_Count, danger_Count, social_Count

    def social_distance_Webcam(self, confidence, people_Dist, vehicle_Dist):
        """
        This function runs the AI on an USB webcam; used for debugging purposes.

        Parameters
        ----------
        confidence : float
            The confidence value for the AI
        
        people_Dist : int
            Distance to be considered a violation between worker-worker

        vehicle_Dist : int
            Distance to be considered a violation between worker-car

        Returns
        -------
        None
        """
        consecFrames = 0
        vid = cv2.VideoCapture(0)

        # get webcam properties
        width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # define the codec and create VideoWriter object
        fourcc = cv2.VideoWriter_fourcc(*'vp80')

        recording = None

        while(True):

            timestamp = datetime.datetime.now()
            ret, frame = vid.read()

            frame, count, danger_Count, social_Count = self.detect_violations_on_frame(frame, confidence, people_Dist, vehicle_Dist)
            # Displays the resulting frame
            cv2.imshow('AI Safety Distance', frame)

            ################### Code to store the violations in video format ################
            if (os.path.exists('violation_Videos\\')) == False:
                os.mkdir('violation_Videos\\')

            if recording is False:
                react_path = 'violation_Videos\\' + timestamp.strftime("%Y%m%d-%H%M%S") + '.webm'
                out = cv2.VideoWriter(react_path, fourcc, 11.0, (width, height))
                recording = True

            elif recording is True:
                if count > 0:
                    consecFrames += 1
                    out.write(frame) # Write new video output
                    print(consecFrames)
                elif count == 0 and consecFrames != 0:
                    print("release recordings 1")
                    out.release()
                    consecFrames = 0
                    print("duration: " + self.get_duration(react_path))
                    # send to .netcore
                    # requests.post('https://localhost:5001/AICamera',
                    #         verify=False, json={"video": file, "camera":string, "duration":self.get_duration(react_path), "violation":string })
                    recording = False

                if consecFrames == 100:
                    print("release recordings 2")
                    out.release()
                    consecFrames = 0
                    print("duration: " + self.get_duration(react_path))
                    # send to .netcore
                    # requests.post('https://localhost:5001/AICamera',
                    #         verify=False, json={"video": file, "camera":string, "duration":self.get_duration(react_path) , "violation":string })
                    recording = False

            # input Q to exit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print('recording finished')
                recording = False
                break

        vid.release()
        cv2.destroyAllWindows()

# distance_based_AI().social_distance_Webcam(OBJECT_CONFIDENCE, SAFE_DISTANCE, CRANE_DISTANCE) # Input Confidence & Distance parameters
