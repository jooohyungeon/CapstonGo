from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from Controller.abf_controller import *

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={
  r"/*": {"origin": "*"},
})


@app.route('/')
def hello_world():
    return 'Hello, world!'


api.add_resource(sign_up, '/sign_up')
api.add_resource(sign_in, '/sign_in')
api.add_resource(regist_face, '/regist_face')
api.add_resource(recognize_face, '/recognize_face')
api.add_resource(test, '/test')


if __name__ == '__main__':
    print('begin server')
    app.run(host='0.0.0.0', port=5055)
