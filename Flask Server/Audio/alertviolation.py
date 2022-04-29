# from winsound import PlaySound
import cv2
import time
from pygame import mixer
import threading
from threading import Thread

# Read parameters from external config file
config = eval(open("../../external.config").read())
Dangerous_Behaviour_Audio = config['Dangerous_Behaviour_Audio']
Safe_Distance_Violation_Audio = config['Safe_Distance_Violation_Audio']

spamValue = 0 #Initiaize spam value

class Alert():
  """
  Class for Distance AI
  ...

  Methods
  -------
  playSoundCar()
      Plays the car violation audio

  playSoundHuman():
      Plays the car violation audio

  sound_alert(total_Count, danger_Count, social_Count)
      Selects the method to play the relevant audio according to the violation type
  """

  def __init__(self):
    """
    Constructor Function to initialize variables and threads

    Parameters
    ----------     
    spam : boolean
        Value to trigger if audio should be played more than once
    
    car_Alert : thread
        Threading for car audio alert

    human_Alert : thread
        Threading for human audio alert

    Returns
    -------
    None
    """
    self.spam = True #Initialize boolean spam
    self.car_Alert = threading.Thread(target = self.playSoundCar) #Initialize Thread for Dangerous Behavior
    self.human_Alert = threading.Thread(target = self.playSoundHuman) #Initialize Thread for Safe Distancing

  def playSoundCar(self):
    """
    This Function is to play sound for when Dangerous Behavior occurs
    Plays ding.mp3 sound file

    Parameters
    ----------     
    sound : module
      Initializes sound file

    Returns
    -------
    None
    """
    mixer.init()
    sound = mixer.Sound(Dangerous_Behaviour_Audio) #Call Sound File
    sound.play()

  def playSoundHuman(self):
    """
    This Function is to play sound for when Safe Distancing VIolation occurs
    Plays dingding.mp3 sound file

    Parameters
    ----------     
    sound : module
      Initializes sound file

    Returns
    -------
    None
    """
    mixer.init()
    sound = mixer.Sound(Safe_Distance_Violation_Audio)
    sound.play()
  
  def sound_alert(self, total_Count, danger_Count, social_Count):
    """
    This Function starts the 2 Audio Threads for Dangerous Behavior and Safe Distancing.

    Parameters
    ----------     
    total_Count : int
      Total number of violations that are occurring

    danger_Count : int
      Number of Dangerious behaviour violations occurring

    social_Count : int
      Number of Social Distance violations occurring

    Returns
    -------
    None
    """
    #Start Thread for Dangerous Behviour
    if danger_Count > 0 and self.spam:
      self.car_Alert.start()
      self.spam = False
      self.car_Alert = False

    #Start Thread for Safe Distancing
    elif social_Count > 0 and self.spam:
      self.human_Alert.start()
      self.spam = False
      self.human_Alert = False

    #Prevent spam of audio
    #Set spam value if 1 violation occurs
    if social_Count > 0 or danger_Count > 0:
      spamValue += 1

    #Stop spam value if more than 2 violation occurs to prevent spam
    if spamValue > 2:
      spamValue = 0

    #Set Thread Functions to play multiple sound at once
    if total_Count == 0 and self.spamValue == 2:
      if self.spam == False:
        self.spam = True
        self.car_Alert = threading.Thread(target = self.playSoundCar) #Thread for Dangerous Behavior
        self.human_Alert = threading.Thread(target = self.playSoundHuman) #Thread for Safe Distance
        spamValue = 0
