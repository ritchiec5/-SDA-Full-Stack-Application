from distutils.debug import DEBUG
from flask import Flask, render_template, Response
from flask_mail import Mail, Message
import cv2
from safedistanceAI import *
import threading
from threading import Thread
from winsound import PlaySound
from pygame import mixer
import os
import time

# Directory of React template for Flask code
template_dir = os.path.abspath('../../React/my-app/src/pages/Distance_AI/components/Distance_LiveStream/templates')

# Read parameters from external config file
config = eval(open("../../external.config").read())

# Initialize a Flask app to send email
app = Flask(__name__, template_folder=template_dir)
mail = Mail(app)

# Initialise AI
AI = distance_based_AI()

# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful when multiple browsers/tabs
# are viewing the stream)
outputFrameDictionary = {}
vsDictionary = {}
lock = threading.Lock()

"""
This function set up message object
"""
def sendEmail(datetime):
    try:
        msg = Message('Hello', sender = config['EMAIL_USERNAME'], recipients = [config['EMAIL_RECIPIENT']])
        msg.body = "Violation occurred at "+ datetime
        with app.app_context():
            mail.send(msg)
        print("Email sent")
    except:
        print("Unsuccessful Email request")

# Configuration for Gmail using SMTP server
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = config['EMAIL_USERNAME']
app.config['MAIL_PASSWORD'] = config['EMAIL_PASSWORD']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

"""
List of camera ip provided through Flask.
Edit the list to add more cameras.
"""
# camera ip
cameras = ["http://42.60.113.58:5003/video/0", "http://42.60.113.58:5003/video/1"]

"""
This function route to React webpage and display homepage
"""
@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.jsx')

"""
This function returns the item (the capturing device) in the list based on the index.
"""
def find_camera(list_id):
    return cameras[int(list_id)]

# initialize the video stream and allow the camera sensor to warmup
try:
	for i in range(len(cameras)):
		vsDictionary["vs{0}".format(i)] = cv2.VideoCapture(find_camera(i))
		time.sleep(2.0)
except:
    pass

"""
This function takes in the capturing device and the index of the camera list.
Within this function, recordings will be created when violations are detected.
The details of the violation will be send to .netcore as well.
"""
def detect_violation(id):
    global lock
    consecFrames = 0
    # vid.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    # vid.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # (width, height, c) = vs.read().shape
    # get webcam properties
    width = int(vsDictionary.get('vs'+str(id)).get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(vsDictionary.get('vs'+str(id)).get(cv2.CAP_PROP_FRAME_HEIGHT))

    # define the codec and create VideoWriter object
    fourcc = cv2.VideoWriter_fourcc(*'vp80')

    recording = False # Set Recording to None for videos not to be saved Or Set to False to start Recording

    # variable to store path
    storeReactPath = ''
    
    while (1):
        timestamp = datetime.datetime.now()
        
        success, frame = vsDictionary.get('vs'+str(id)).read()  # read the camera frame
        frame, count, danger_Count, social_Count = distance_based_AI().detect_violations_on_frame(frame, OBJECT_CONFIDENCE, SAFE_DISTANCE, CRANE_DISTANCE)
        getFrame = frame
        with lock:
            outputFrameDictionary["outputFrame{0}".format(id)] = frame.copy()
        
        #################### Code to store the violations in video format ################
        currentDateTime = timestamp.strftime("%Y%m%d-%H%M%S")
        react_path = '../../React/my-app/public/AI_Video/' + "Camera" + str(id) + "_" + currentDateTime + '.webm'
        file = "AI_Video/" + "Camera" + str(id) + "_" + currentDateTime + '.webm'
        storeDateTime = currentDateTime

        if recording is False:
            # detect violation
            if count > 0:
                # start recording
                out = cv2.VideoWriter(react_path, fourcc, 11.0, (width, height))
                storeReactPath = react_path
                storeFile = file
                recording = True

        elif recording is True:
            # detect violation -> write video frame
            if count > 0:
                out.write(getFrame)
                print(consecFrames)
                consecFrames += 1
                if social_Count > 0:
                    social_bool = True
                elif danger_Count > 0:
                    danger_bool = True

            # if no violation & video > 1 sec (to prevent 0 sec video)
            if count == 0 and consecFrames >= 20:
                print("release recordings")
                out.release()
                consecFrames = 0
                print(AI.get_duration(storeReactPath))
                # send to .netcore
                # if social_bool:
                #     requests.post('https://localhost:5001/DistanceVideo',
                #             verify=False, json={"video": storeFile, "camera": str(id), "duration":AI.get_duration(storeReactPath), "violation": 'SD' })
                #     social_bool = False
                # elif danger_bool:
                #     requests.post('https://localhost:5001/DistanceVideo',
                #             verify=False, json={"video": storeFile, "camera": str(id), "duration":AI.get_duration(storeReactPath), "violation": 'DB' })
                #     danger_bool = False
                recording = False
                # Sends violation Email to Recipient
                threading.Thread(target = sendEmail, args = (storeDateTime, )).start()
            # if no violation & video < 1 sec, delete video
            elif count == 0 and consecFrames < 20:
                print("video too short, deleting video")
                out.release()
                consecFrames = 0
                # delete video
                if os.path.isfile(storeReactPath):
                    os.remove(storeReactPath)
                recording = False
            # if video > 5 sec
            elif consecFrames == 100:
                print("release recordings 2")
                out.release()
                consecFrames = 0
                print(AI.get_duration(storeReactPath))
                # send to .netcore
                # if social_Count > 0:
                #     requests.post('https://localhost:5001/AICamera',
                #             verify=False, json={"video": storeFile, "camera": str(id), "duration":AI.get_duration(storeReactPath), "violation": 'SD' })
                # elif danger_Count > 0:
                #     requests.post('https://localhost:5001/AICamera',
                #             verify=False, json={"video": storeFile, "camera": str(id), "duration":AI.get_duration(storeReactPath), "violation": 'DB' })
                recording = False
                # Sends violation Email to Recipient
                threading.Thread(target = sendEmail, args = (storeDateTime, )).start()
     
"""
This function generates and gets each frame from the video feed
"""
def generate(id):
	# grab global references to the output frame and lock variables
	global lock
	# loop over frames from the output stream
	while True:
		# wait until the lock is acquired
		with lock:
			# check if the output frame is available, otherwise skip
			# the iteration of the loop
			if outputFrameDictionary.get('outputFrame'+str(id)) is None:
				continue
			# encode the frame in JPEG format
			(flag, encodedImage) = cv2.imencode(".jpg", outputFrameDictionary.get('outputFrame'+str(id)))
			# ensure the frame was successfully encoded
			if not flag:
				continue
		# yield the output frame in the byte format
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
			bytearray(encodedImage) + b'\r\n')

"""
This function takes in the index of the camera list and returns the response object.
"""
@app.route('/video/<int:id>')
def video_feed(id):
    try:
        #Video streaming route. Put this in the src attribute of an img tag
        return Response(generate(id), mimetype='multipart/x-mixed-replace; boundary=frame')
    except Exception as e:
        return e

"""
Python program to execute
"""
if __name__ == '__main__':
    # start a thread that will perform violation detection
    for i in range(len(cameras)):
        t = threading.Thread(target=detect_violation, args=(i, ))
        t.daemon = True
        t.start()
    app.run(host='0.0.0.0', port=5004, threaded=True, debug=True, use_reloader=False)

# release the video stream pointer
for i in range(len(cameras)):
	vsDictionary.get('vs'+str(i)).release()