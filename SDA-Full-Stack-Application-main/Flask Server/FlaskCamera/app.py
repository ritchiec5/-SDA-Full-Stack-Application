from flask import Flask, render_template, Response
import os
import cv2
import threading
import time

template_dir = os.path.abspath('../../React/my-app/src/pages/Distance_AI/components/Test_Cameras/templates')

# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful when multiple browsers/tabs
# are viewing the stream)
lock = threading.Lock()

outputFrameDictionary = {}
vsDictionary = {}

#Initialize the Flask app
app = Flask(__name__, template_folder=template_dir)

"""
List of camera accesses.
Edit the list to add more cameras.
"""
# ip cameras
# cameras = [
#  "rtsp://username:password@ip_address:554/stream_no"
#   ]
# web cameras
cameras = [0, 1]

"""
This function route to test Flask Camera on React page
"""
@app.route('/')
def index():
    """Test camera page."""
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
This function initializes the camera to be used
"""
def open_camera(id):
	# grab global references to the video stream, output frame, and lock variables
	global lock
	# loop over frames from the video stream
	while True:
		# read the next frame from the video stream
		ret, frame = vsDictionary.get('vs'+str(id)).read()

		# acquire the lock, set the output frame, and release the lock
		with lock:
			outputFrameDictionary["outputFrame{0}".format(id)] = frame.copy()
         
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
        return Response(generate(id), mimetype = "multipart/x-mixed-replace; boundary=frame")
    except Exception as e:
        return e

"""
Python program to execute
"""
if __name__ == '__main__':
    # start a thread that will connect a camera
	for i in range(len(cameras)):
		t = threading.Thread(target=open_camera, args=(i, ))
		t.daemon = True
		t.start()
	app.run(host='0.0.0.0', port=5003, threaded=True, debug=True, use_reloader=False)

# release the video stream pointer
for i in range(len(cameras)):
	vsDictionary.get('vs'+str(i)).release()