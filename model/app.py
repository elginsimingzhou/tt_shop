from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask import Flask
from flask_restful import Api, Resource, reqparse
import os
import requests
import cv2
from ultralytics import YOLO
import pytesseract
import re
import nltk
from nltk.corpus import stopwords, words, wordnet
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from wordfreq import word_frequency

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('words')
nltk.download('wordnet')

app = Flask(__name__)
api = Api(app)

video_post_args = reqparse.RequestParser()
video_post_args.add_argument("video_url", type=str, help="Video url is required to generate keywords for video", required = True)

def download_video(url, file_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                f.write(chunk)
    else:
        raise Exception(f"Failed to download video from {url}")

def extract_frames(video_path, num_frames=20):
    cap = cv2.VideoCapture(video_path)
    frames = []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_indices = [int(i * total_frames / num_frames) for i in range(num_frames)]

    for idx in range(total_frames):
        ret, frame = cap.read()
        if not ret:
            break
        if idx in frame_indices:
            frames.append(frame)

    cap.release()
    return frames

def detect_objects(model, frames):
    results = []
    for frame in frames:
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        predictions = model.predict(rgb_frame, conf=0.5)

        for result in predictions:
            boxes = result.boxes
            for box in boxes:
                cls = box.cls.item()
                label = model.names[int(cls)]
                results.append(label)
    return results

def extract_text(frames):
    text_results = []
    valid_words = set(words.words())
    valid_words.update(wordnet.words())

    for frame in frames:
        text = pytesseract.image_to_string(frame)
        text = text.lower()
        text = re.sub(r'\W+', ' ', text)
        words_list = word_tokenize(text)
        filtered_words = [
            word for word in words_list
            if word not in stopwords.words('english')
            and (word in valid_words or word_frequency(word, 'en') > 0)
            and len(word) > 2
        ]

        text_results.extend(filtered_words)
    return text_results

def extract_keywords_tfidf(texts):
    vectorizer = TfidfVectorizer(max_features=20)
    X = vectorizer.fit_transform(texts)
    keywords = vectorizer.get_feature_names_out()
    tfidf_scores = X.toarray().flatten()
    keyword_score_pairs = list(zip(keywords, tfidf_scores))
    sorted_keyword_score_pairs = sorted(keyword_score_pairs, key=lambda x: x[1], reverse=True)
    sorted_keywords = [pair[0] for pair in sorted_keyword_score_pairs]
    return sorted_keywords

def process_video(video_path):
    frames = extract_frames(video_path)
    model = YOLO('yolov8l-world.pt')
    object_detections = detect_objects(model, frames)
    text_detections = extract_text(frames)
    all_text = ' '.join(object_detections + text_detections)
    keywords_tfidf = extract_keywords_tfidf([all_text])
    filtered_keywords = [keyword for keyword in keywords_tfidf if keyword.lower() != 'tiktok']
    top_5_keywords = filtered_keywords[:5]
    return top_5_keywords   

class Home(Resource):
    def get(self):
        return 'Flask server is running'

class Video(Resource):
    def post(self, video_id):
        args = video_post_args.parse_args()
        video_url = args['video_url']
        video_path = f"video_{video_id}.mp4"

        try:
            download_video(video_url, video_path)
            keywords = process_video(video_path)
            os.remove(video_path)
        except Exception as e:
            return {"error": str(e)}, 500

        return {"video_id": video_id, "keywords": keywords}, 201


api.add_resource(Home, "/")
api.add_resource(Video, "/videos/<int:video_id>")

if __name__ == "__main__":
    app.run(debug=True)
