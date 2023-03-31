import pickle
import string
import nltk
import eli5
import json
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('porter_test')
from nltk.corpus import stopwords
from flask_cors import CORS
import firebase_admin
from bs4 import BeautifulSoup
import requests
from firebase_admin import credentials
from firebase_admin import storage
from firebase_admin import firestore
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
import pytz
import server

app = Flask(__name__)
CORS(app,resources={r'/': {'origins': ''}})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# Fetch the serviceAccountKey.json file from Github
url = 'https://raw.githubusercontent.com/rajeshkumar-2002/Fake-review-predection/main/server/serviceAccountKey.json'
response = requests.get(url)
content = response.content.decode('utf-8')
# Load the file content into a JSON object
json_data = json.loads(content)

cred = credentials.Certificate(json_data)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fake-review-prediction.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()

def preprocess_text(text):
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = text.lower()
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [token for token in tokens if token not in stop_words]
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(token) for token in filtered_tokens]
    preprocessed_text = " ".join(stemmed_tokens)
    return preprocessed_text

# with open('C:/Users/rk916/OneDrive/Desktop/Python Env/Mobile/server/Mobile_svm_model.pkl', 'rb') as f:
#     svm_model = pickle.load(f)

# with open('C:/Users/rk916/OneDrive/Desktop/Python Env/Mobile/server/vectorizer.pkl', 'rb') as f:
#     vectorizer = pickle.load(f)

try: 
   blob = bucket.blob("App_Model/Mobile_svm_model.pkl")
   svm_model = pickle.loads(blob.download_as_string())

   vec = bucket.blob("App_Model/vectorizer.pkl")
   vectorizer = pickle.loads(vec.download_as_string())

   print("Model downloaded Successfully")
except:
   print("Error while downloading model")

def prediction(new_input):

    preprocessed_input = preprocess_text(new_input)

    new_input_vec = vectorizer.transform([preprocessed_input])

    prediction = svm_model.predict(new_input_vec)

    prediction_res = int(prediction[0])

    feature_names = vectorizer.get_feature_names_out()
    res = eli5.explain_prediction(svm_model, doc=new_input, vec=vectorizer, target_names=['fake', 'genuine'], feature_names=feature_names)
    res = res.targets[0].weighted_spans

    doc_weighted_spans = res.docs_weighted_spans[0]
    spans = doc_weighted_spans.spans

    spans_dict = {}
    sum = 0

    for span in spans:
        span_text = span[0]
        span_weight = span[2]
        spans_dict[span_text] = span_weight
        sum+=span_weight

    Highlighted_text_sum = round(sum, 3)

    res = {'Highlighted_text_sum' : Highlighted_text_sum, 'words' : spans_dict, 'result' : prediction_res}

    return res

def dataTofirebase(review,prediction_res):
   try:
      doc_ref = db.collection("reviews").document()
      doc_ref.set({
         "review_text": review,
         "label": prediction_res
      })
      print("Data Added Successfully to the firestore")
   except:
      print("Error while ading data to firestore")

@app.route('/predict',  methods=['POST'])
def predict():
   try:
       review = str(request.json['review'])
       res = prediction(review)
       dataTofirebase(review,res)
       return jsonify({'message':"Success","Data":res}), 200
   except:
       return jsonify({'message':"Failed"}), 400
   
@app.route('/data', methods=['GET'])
def data():
   try:
      collection_ref = db.collection('Data')
      docs = collection_ref.get()
      Data = {}
      for doc in docs:
         Data = doc.to_dict()
      return jsonify({"status":"success","data":Data}), 200
   except:
      print("error while retrying the data!")
      return jsonify({"status":"failled"}), 400

@app.route('/appurl', methods=['POST'])
def appurl():
         url = request.json['url']
         review_list = []
    
         if 'amazon' in url:
            # Amazon URL
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')
            reviews = soup.find_all('div', {'class': 'a-section review aok-relative'})
            print("res",reviews)
            for review in reviews:
               title = review.find("a", {"data-hook": "review-title"}).text.strip()
               rating = float(review.find("i", {"data-hook": "review-star-rating"}).text.split()[0])
               text = review.find("span", {"data-hook": "review-body"}).text.strip()
               try:
                  res = prediction(text)
               except:
                  print("error While loading the model !")   

               review_list.append({'rating': rating, 'title': title, 'text': text,'data':res})
            
         elif 'flipkart' in url:
            # Flipkart URL product-reviews
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            reviews = soup.find_all('div', {'class': 'col _2wzgFH K0kLPL'})

            for review in reviews:
               rating = review.find('div', {'class': ['_3LWZlK', '']}).text.strip()
               title = review.find('p', {'class': '_2-N8zT'}).text.strip()
               text = review.find('div', {'class': 't-ZTKy'}).text.strip()
               try:
                  res = prediction(text)
               except:
                  print("error While loading the model !")   

               review_list.append({'rating': rating, 'title': title, 'text': text,'data':res})
            
         else:
            # Unknown URL
            return jsonify({"error":"Please Enter the proper URL"}), 400
         
         if len(reviews) == 0:
            return jsonify({"error":"No reviews found !"}), 400
            
         return jsonify({"reviews":review_list}), 200

def Update():
   print("Update Funtion")
   server.start(db,bucket)

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
scheduler.add_job(func=Update, trigger='cron', hour=12, minute=35)
scheduler.start()

if __name__ == '__main__':
   app.run(debug=True,host='0.0.0.0')
