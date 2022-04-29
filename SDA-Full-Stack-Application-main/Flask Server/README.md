# Setting Up Flask

## Pre Flask Setup
Ensure all requirements are installed from the requirements.txt
``` bash
pip install -r requirements.txt
```

## Installation
Ensure Flask have been installed
``` bash
pip install flask
```

## Usage
``` bash
cd 2021-TEAM-21/Flask/FlaskAI

#For Windows
set FLASK_APP=app.py

#For Huawei Cloud
export FLASK_APP=app

python app.py
```
Visit the local host address

![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/FlaskExample.PNG)

Ensure to run Flask before running Yarn

## Configuration

### Configurating IP and Port
 ```python
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5004, threaded=True, debug=True, use_reloader=False)
```

host: Sets the ip address\
port: Sets the port

### Configurating Cameras (FlaskAI)
- Navigate to FlaskAI app.py

```python
"""
List of camera accesses
Edit the list to add more cameras.
"""
# camera ips
cameras = [
 "http://ip_address:port/video/number",
 "http://ip_address:port/video/number"
  ]
```

#### IP Camera:
ip_address: The ip address of the camera\
port: The port of the camera\
number: The index of the camera list in FlaskCamera (for ip camera)

### Configurating Cameras (FlaskCamera)
- Navigate to FlaskCamera app.py

```python
"""
List of camera accesses
Edit the list to add more cameras.
"""
# Security Camera
cameras = ["rtsp://username:password@ip_address:554/stream_no", "rtsp://username:password@ip_address:554/stream_no"]
# Web Camera
cameras = [0, 1]
```

#### Security Camera:
username: Username of security camera\
password: Password of security camera\
ip_address: The ip address of the security camera\
554: Default port of the camera

=======
### Configurating Email Details
- Navigate to external.config in Root folder
For Sender:
``` bash
Change "EMAIL_USERNAME" to desired email
Example:
"EMAIL_USERNAME" : 'sender@send.com'
Change "EMAIL_PASSWORD" to email account password
Example:
"EMAIL_PASSWORD" : 'Password'
```
For Receiver:
``` bash
Change EMAIL_RECIPIENT to desired email
Example:
"EMAIL_RECIPIENT" : 'receiver@receive.com'
```

### Configurating Audio Files
For Safety Distance Violation Audio Prompt:
``` bash
Change "Safe_Distance_Violation_Audio" to desired audio file. (Ensure to include file format)
Example:
"Safe_Distance_Violation_Audio" : "Distance.mp3"
```
For Dangerous Behavior Audio Prompt
``` bash
Change "Dangerous_Behaviour_Audio" to desired audio file. (Ensure to include file format)
Example:
"Dangerous_Behaviour_Audio" : "Distance.mp3"
```

# Training of AI Model

## Adding Custom dataset
1) Ensure labelled data and corresponding images are residing in the correct folder specified in the yaml file of training and testing data.
2) Split the data accordingly to training and testing sets for the AI Model to validate once finish training. (Preferably 80/20 ratio)
3) A sample google collaboratory notebook for training custom data can be accessed with the following link:
https://colab.research.google.com/github/roboflow-ai/yolov5-custom-training-tutorial/blob/main/yolov5-custom-training.ipynb

## Access the python notebook file from the repository and import into google collab.
``` bash
colab.research.google.com
```
## Enable Hardware Accelerator to use Google's GPUs
``` bash
Edit -> Notebook settings -> Hardware Accelerator -> GPU
```
## Run the cell containing !nvidia-smi to confirm Google GPUs are being used.
``` bash
!nvidia-smi
```
## Mount the google drive containing training data to the google collab instance.
``` bash
drive.mount('/content/gdrive')
```
## Wandb is optional in model training but can be used to track the training of the model efficiently.
``` bash
Tensorboard:
%load_ext tensorboard
%tensorboard --logdir runs/train
```

``` bash
Weights & Biases - Model Accuracy & Training Tracker:
%pip install -q wandb
import wandb
wandb.login()
```
## Run the cell containing train.py to train the AI model checkpoint
``` bash
!python train.py --img 640 --batch 4 --epochs 3 --data coco128.yaml --weights yolov5s.pt --cache
```
\
img: Sets the quality of the image being trained. (Leave at 640)\
batch: Amount of data to be trained in batches. (Recommended value to be in powers of 2)\
epochs: Amount of iterations which the AI model will be trained on.\
data: Use yaml file containing filepaths of train and test data.\
weights: YOLOv5 model checkpoint to be used. (E.g. yolov5s, yolov5m, yolov5l)\
\
Trained AI Model will be saved in the collab instance under the 'Run' directory.

# Setting up AI dependancies

## Install Libraries from requirements.txt
Run the following command on project environment:
``` bash
pip install -r requirements.txt
```

## Ensure AI Model checkpoint is correctly specified in the external configuration file and located within the flask directory
``` bash
AI_Model : [.pt file]
```
