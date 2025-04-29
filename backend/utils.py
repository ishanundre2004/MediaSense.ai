import cv2

def calculate_blurriness(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()

def calculate_proximity(bbox):
    return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])

def get_color(value):
    return 'red' if value < 25 else 'orange' if value < 50 else 'lightgreen' if value < 75 else 'darkgreen'