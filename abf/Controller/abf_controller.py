from flask_restful import Resource
from flask import request
import pymysql
import cv2
import json
import requests
import PIL.Image
import io
import numpy
import os
import sys
import base64
import threading

sys.path.append('..')
from Mtcnn.Application import abf_demo
from Mtcnn.Application import abf_set_data
from Mtcnn.Camera import *
from Mtcnn.Database import *
from Mtcnn.Model import *
from Mtcnn.Pretrained_model import *
from Mtcnn.src import *


class sign_up(Resource):
    def post(self):
        try:
            post_data = request.data
            datas = json.loads(post_data)
            user_id = datas['user_id']
            passwd = datas['passwd']
            name = datas['name']
            type_code = datas['type']
            member_id = datas['member_id']
            grade = datas['grade']
            dept = datas['dept']
            major = datas['major']
            phone_num = datas['phone_num']
            e_mail = datas['e_mail']
            print(1)

            conn = pymysql.connect(host='203.233.111.5', port=3306, user='aham', password='1234',
                                   db='abf', charset='utf8')

            print(1)

            try:
                # SELECT
                with conn.cursor() as curs:
                    sql = "select * from user where user_id = %s"
                    res = curs.execute(sql, (user_id))
                    print(res)

                    if res != 0:
                        return "user_id already sign up"
            except Exception as e:
                return {
                    'error': str(e)
                }

            print(1)

            try:
                # INSERT
                print(1)
                with conn.cursor() as curs:
                    sql = "insert into user(user_id, passwd, name, type, member_id, grade, dept, major, phone_num, e_mail)" \
                          " values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                    print(1)
                    res = curs.execute(sql, (user_id, passwd, name, type_code, member_id, grade, dept, major, phone_num, e_mail))
                    print(2)

                conn.commit()
                print(1)

            finally:
                conn.close()

            print(1)

            return 200

        except Exception as e:
            return {
                'error': str(e)
            }


class sign_in(Resource):
    def post(self):
        try:
            post_data = request.data
            datas = json.loads(post_data)
            user_id = datas['user_id']
            print(user_id)
            passwd = datas['passwd']
            print(passwd)

            conn = pymysql.connect(host='203.233.111.5', port=3306, user='aham', password='1234',
                                   db='abf', charset='utf8')

            try:
                # SELECT
                with conn.cursor() as curs:
                    sql = "select passwd from user where user_id = '"+user_id+"';"
                    print(sql)
                    res = curs.execute(sql)

                    print(res)
                    if res is None:
                        return 400
                    elif res["passwd"] != passwd:
                        return 500

            finally:
                conn.close()

            return 200
        
        except Exception as e:
            return {
                'error': str(e)
            }

class regist_face(Resource):
    def post(self):
        try:
            post_data = request.data
            datas = json.loads(post_data)
            member_id = datas['member_id']

            name = None

            # conn = pymysql.connect(host='203.233.111.5', port=3306, user='aham', password='1234',
            #                        db='abf', charset='utf8')

            # try:
            #     # SELECT
            #     with conn.cursor() as curs:
            #         sql = "select name from user where member_id = '" + member_id + "';"
            #         print(sql)
            #         curs.execute(sql)
            #         res = curs.fetchone()

            #         print(res)
                    
            #         if res is None:
            #             return {
            #                 "member_id": member_id,
            #                 "name": "undefine",
            #                 "result": "undefine"
            #             }
                    
            #         name = res
            # finally:
            #     conn.close()

            # print(1)

            # file_name = member_id
            dir_path = "/home/aham/hyungeon/abf/Mtcnn/Database/npy"
            # file_path = dir_path + file_name

            # if not os.path.isdir(file_path):
            #     os.mkdir(file_path)
            # else:
            #     os.rmdir(file_path)
            #     os.mkdir(file_path)

            image = datas['image']

            img_str = base64.b64decode(image)

            insert = abf_set_data.ABF_Insert()

            insert.process(img_str, dir_path, member_id)

            print("complete regist face")

            return {
                "member_id": member_id,
                "name": name,
                "result": "success"
            }

        except Exception as e:
            return {
                "member_id": "undefine",
                "name": "undefine",
                "result": "error"
            }


class recognize_face(Resource):
    def post(self):
        try:
            post_data = request.data
            datas = json.loads(post_data)
            # print(datas)
            # member_id = datas['member_id']
            class_id = datas['class_id']
            date = datas['date']
            # print(member_id)

            conn = pymysql.connect(host='203.233.111.5', port=3306, user='aham', password='1234',
                                   db='abf', charset='utf8')

            member_list = []

            try:
                # SELECT
                with conn.cursor() as curs:
                    sql = "SELECT member_id FROM abf.apply where class_id = '" + class_id + "';"
                    curs.execute(sql)
                    res = curs.fetchall()
                    
                    print(res)
                    print(len(res))

                    for i in res:
                        print(i[0])
                        member = str(i[0]) + ".npy"
                        member_list.append(member)
            except Exception as e:
                return "undefined class"

            finally:
                conn.close()

            name = None

            # file_name = str(member_id)
            dir_path = "/home/aham/hyungeon/abf/Mtcnn/Database/npy"
            # img_path = dir_path + file_name

            image = datas['image']

            img_str = base64.b64decode(image)

            demo = abf_demo.ABF_Demo()
            
            who, results = demo.process(img_str, dir_path, member_list)

            print(who)
            print(results)

            member_id = who.split('.')[0]

            conn = pymysql.connect(host='203.233.111.5', port=3306, user='aham', password='1234',
                                   db='abf', charset='utf8')

            try:
                # SELECT
                with conn.cursor() as curs:
                    sql = "select * from user where member_id = '" + member_id + "';"
                    curs.execute(sql)
                    res = curs.fetchone()
                    
                    if res is None:
                        return {
                            "member_id": member_id,
                            "name": "undefine",
                            "result": "undefine"
                        }
                    name = res[2]
            finally:
                conn.close()

            if results == "Success":
                print(0)
                keys = self.get_key(member_id, class_id, date)
                try:
                    print(keys)
                    transaction_result = threading.Thread(target=self.send_transaction, args=(keys, results))
                    transaction_result.start()
                    print(1)
                except Exception as e:
                    print(str(e))
                    return e

            res_send = {
                "member_id": member_id,
                "name": name,
                "result": results
            }

            print(res_send)

            return res_send
        except Exception as e:
            return {
                "member_id": "undefine",
                "name": "undefine",
                "result": "error"
            }

    @staticmethod
    def send_transaction(keys, results):
        print("start transaction")

        send_data = {
                    'key': keys,
                    'result': results
        }

        headers = {'Content-Type': 'application/json; charset=utf-8'}

        result_data = requests.post(url="http://203.233.111.7:5050/update_ledger", data = json.dumps(send_data), headers = headers)

    def get_key(self, member_id, class_id, date):
        get_trx = requests.get(url="http://203.233.111.7:5050/get_ledger")

        ledger_list = json.loads(get_trx.content)

        trx_lists = []

        for ledger in ledger_list:
            if ledger["Record"]["user"] == str(member_id) and ledger["Record"]["date"] == str(date) and ledger["Record"]["verifier"] == str(class_id):
                return ledger["key"]


class test(Resource):
    def post(self):
        try:
            post_data = request.data
            datas = json.loads(post_data)
            print(datas)
            # image = datas['image']

            class_id = datas['class_id']

            

            return 200
        except Exception as e:
            return{
                str(e)
            }

    def get(self):
        return "need cors"