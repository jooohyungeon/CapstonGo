import cv2
import numpy as np
import os, sys
import argparse
import mxnet as mx
import datetime, time
import requests
import json

from ..Camera import camera
from ..Model import face_model
from ..Database import face_db
from ..src import tools

parser = argparse.ArgumentParser(description='face model test')
parser.add_argument('--image-size', default='112,112', help='')
# model check
parser.add_argument('--model', default='/home/aham/hyungeon/abf/Mtcnn/Pretrained_model/model-r100-ii',
                    help='path to load model.')
parser.add_argument('--ga-model', default='', help='path to load gender age model.')
parser.add_argument('--gpu', default=0, type=int, help='gpu id')
parser.add_argument('--det', default=0, type=int, help='mtcnn option, 1 means using R+O, 0 means detect from beginning')
parser.add_argument('--flip', default=0, type=int, help='whether do lr flip aug')
parser.add_argument('--threshold', default=1.24, type=float, help='ver dist threshold')
parser.add_argument('--score', default=0.99, type=float,  # 0.999여도 좋을지도
                    help='if detected face''s score is lower than this, than it will not be detected as face')
parser.add_argument('--similarity', default=0.50, type=float,
                    help='if similarity between two face is above this means those two are the same face')
parser.add_argument('--save', default=False, type=bool,
                    help='True if you want to save images and npy of faces in this demo')
# what is the best similarity? 0.55, maybe.
args = parser.parse_args()


EndPoint = "http://192.168.0.12:5000/face_recog"


class ABF_Demo:
    def __init__(self):

        self.model = face_model.FaceModel(args, ctx=mx.cpu())
        self.db = face_db.Database()
        self.camera = camera.Camera(url='http://aham_demo_raspi1.com.ngrok.io/?action=snapshot')
        # self.camera.picam_run()
        # self.camera = camera.Camera(camera_address=0)
        # self.camera.run()
        self.time = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        print("current time is: ", self.time)

    def process(self, detected_image, img_url, member_list):
        self.time = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')

        t1 = time.time()

        self.frame = self.camera.get_image(detected_image)
        # self.ret, self.frame = self.camera.cam.read()

        self.frame = cv2.resize(self.frame, (640, 360))

        boxes, points, results = self.model.get_input_new(face_img=self.frame)

        results = self.model.get_input_nd(face_img=self.frame)
 
        # print("111111111111111")
        # print(boxes)
        # print(results)
        # print(points)
        # if boxes is not None:
        #     print(np.shape(boxes[:, 0])[0], "people found")

        #     for i in range(np.shape(boxes[:, 0])[0]):
        #         print(f'{i}: score {boxes[i, :][4]}')

        # boxes, points, results = tools.detector(boxes, points, results, args.score)

        # print("2222222222222222")
        # print(boxes)
        # print(results)
        # print(points)

        # tools.draw(boxes, points, self.frame)
        result = self.recognize(points, results, img_url, member_list)

        t2 = time.time()
        print("took {} seconds\n".format(t2 - t1))

        # cv2.imshow("detection result", self.frame)
        cv2.waitKey(30)

        return result

    # see this person is in the database. save: save new faces in the database
    def recognize(self, points, results, img_url, member_list, save=args.save):
        if results is None:
            return
        list = os.listdir(self.db.npy_file_path(img_url))
        # print(compare_img)
        features = self.model.get_feature_new(results)
        #new_faces = self.model.get_image(img=self.frame, points=points)
        result = "Fail"

        if (len(list)) == 0:
            print("No faces saved in the database")
            if (save == True):
                #self.db.save(time=self.time, img=new_faces[0], data=features[0])
                print("saved first feature and image in the list")

            elif (save == False):
                print("no data saved in the database. returning..")
                return

        who = None

        for f in features:
            high_sim = 0
            
            for l in list:
                # print(self.db.npy_load(compare_img[0]).shape)
                if l in member_list:
                    sim = self.db.sim(f, self.db.npy_load(l))
                    print("--------------------\n"+l+"'s similarity : " + str(sim))
                    print("--------------------\n")
                    if sim > args.similarity:
                        result = "Success"
                        if sim > high_sim:
                            high_sim = sim
                            who = l

        return who, result


