from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)

video_post_args = reqparse.RequestParser()
video_post_args.add_argument("video_url", type=str, help="Video url is required to generate keywords for video", required = True)

class Home(Resource):
    def get(self):
        return 'Flask server is running'

class Video(Resource):
    def post(self, video_id):
        args = video_post_args.parse_args()
        # print(args)
        video_url = args['video_url']
        # print(video_url)

        #################
        #   Do some ML  #
        #################

        # TODO: Replace sample keywords
        keywords = ['hair curler', 'haircare', 'women', 'curls', 'airwrap']

        return {"video_id": video_id, "keywords": keywords}, 201


api.add_resource(Home, "/")
api.add_resource(Video, "/videos/<int:video_id>")

if __name__ == "__main__":
    app.run(debug=True)
