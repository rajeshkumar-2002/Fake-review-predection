from flask import Flask, render_template,request
import pickle
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from firebase_admin import firestore
import server
from bs4 import BeautifulSoup
import requests
import os
from apscheduler.schedulers.background import BackgroundScheduler
import pytz

# os.system('cls')

app = Flask(__name__)

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fake-review-prediction.appspot.com'
})

db = firestore.client()
bucket = storage.bucket()

try: 
   blob = bucket.blob("models/best_model_svm.pkl")
   model = pickle.loads(blob.download_as_string())

   vec = bucket.blob("models/tfidf_vectorizer.pkl")
   count_vec = pickle.loads(vec.download_as_string())

   print("Model downloaded Successfully")
except:
   print("Error while downloading model")

try:
   collection_ref = db.collection('Data')
   docs = collection_ref.get()
   Data = {}
   for doc in docs:
      Data = doc.to_dict()
except:
   print("error while retrying the data!")

print(Data)

@app.route('/')
def Index():
   return render_template('index.html', Data=Data)

@app.route('/predict', methods=['POST'])
def predict():
   review = request.form['review']
   res = "error while loading the model !"
   try:
      review_vector = count_vec.transform([review])
      prediction = model.predict(review_vector)
      res = "The given Review is Fake Review."
      prediction_res = int(prediction[0])
      if(prediction==2):
         res = "The given Review is Genuine Review."
      try:
         doc_ref = db.collection("reviews").document()
         doc_ref.set({
            "review_text": review,
            "label": prediction_res
            })
         print("Data Added Successfully to the firestore")
      except:
         print("Error while ading data to firestore")
   except:
      print("error While loading the model !")

   return render_template('index.html', prediction=res,Data=Data)

@app.route('/appurl', methods=['GET', 'POST'])
def appurl():
    if request.method == 'POST':
         url = request.form['url']
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
               isfake = False
               try:
                  review_vector = count_vec.transform([text])
                  prediction = model.predict(review_vector)
                  prediction_res = int(prediction[0])
                  if(prediction_res==2):
                     isfake = True
               except:
                  print("error While loading the model !")   

               review_list.append({'rating': rating, 'title': title, 'text': text,'isfake':isfake})
            
         elif 'flipkart' in url:
            # Flipkart URL product-reviews
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            reviews = soup.find_all('div', {'class': 'col _2wzgFH K0kLPL'})

            for review in reviews:
               rating = review.find('div', {'class': ['_3LWZlK', '']}).text.strip()
               title = review.find('p', {'class': '_2-N8zT'}).text.strip()
               text = review.find('div', {'class': 't-ZTKy'}).text.strip()
               isfake = False
               try:
                  review_vector = count_vec.transform([text])
                  prediction = model.predict(review_vector)
                  prediction_res = int(prediction[0])
                  if(prediction_res==2):
                     isfake = True
               except:
                  print("error While loading the model !")   

               review_list.append({'rating': rating, 'title': title, 'text': text,'isfake':isfake})
            
         else:
            # Unknown URL
            return render_template('full_review.html',error="Please Enter the proper URL")
         
         if len(reviews) == 0:
            return render_template('full_review.html',error="No reviews found !")
         
            
         return render_template('full_review.html', reviews=review_list)
    
    return render_template('full_review.html')

def Update():
   print("Update Funtion")
   server.start(db,bucket)

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))
scheduler.add_job(func=Update, trigger='cron', hour=12, minute=35)
scheduler.start()

if __name__ == '__main__':
   app.run(debug=True)