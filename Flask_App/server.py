import nltk
import re
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def text_preprocessing(text):
    ps = PorterStemmer()
    sw_nltk = stopwords.words('english')
    stemmed = []

    removed_special_characters = re.sub("[^a-zA-Z]", " ", str(text))
    lower = removed_special_characters.lower()
    removed_stop_words = [lower for lower in lower.split() if lower.lower() not in sw_nltk]
    new_text = " ".join(removed_stop_words)
    words = word_tokenize(new_text)
    for w in words:
        token = ps.stem(w)
        stemmed.append(token)

def upload_file_to_firebase_storage(file_path, file_name, bucket):
    try:
        blob = bucket.blob('model/'+file_name)
        blob.upload_from_filename(file_path)
        print("Upload success !")
    except:
        print("Upload Faild !")

def train_model(X, y,bucket,db):

    try: 
        blob = bucket.blob("models/best_model_svm.pkl")
        prediction_svm = pickle.loads(blob.download_as_string())

        vec = bucket.blob("models/tfidf_vectorizer.pkl")
        TFIDF_vectorizer = pickle.loads(vec.download_as_string())

        print("Model downloaded Successfully")

    except:
        print("Error while downloading model")

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    TFIDF_vectorizer  = TfidfVectorizer(stop_words='english')
    train_tf = TFIDF_vectorizer.fit_transform(X_train)
    test_tf = TFIDF_vectorizer.transform(X_test)

    #IMPLEMENTING AND RUNNING SVM MODEL - TFIDF
    prediction_svm.fit(train_tf,y_train)
    print("Accuracy",prediction_svm.score(test_tf, y_test))
    pickle.dump(prediction_svm, open('./best_model_svm.pkl', 'wb'))

    try:
        acc = prediction_svm.score(test_tf, y_test)*100
        formated_acc = "{:.2f}%".format(acc)
        try:
            collection_name = 'Data'
            document_id = 'Data'
            doc_ref = db.collection(collection_name).document(document_id)
            data = {
                'Accuracy':formated_acc
            }
            doc_ref.update(data)
            try:
                collection_ref = db.collection('reviews')
                docs = collection_ref.stream()
                for doc in docs:
                    doc.reference.delete()
                try:
                    upload_file_to_firebase_storage('./best_model_svm.pkl','best_model_svm.pkl',bucket)
                    print("Pkl file updated Successfully")
                except:
                    print("Error while Updating the pkl file")
            except:
                print("Error while deleting the data")
        except:
            print("error while updating the acc data")
    except:
        print("Error while finding the acc !")

def retrain_model(db,bucket):

    try:
        reviews = db.collection('review').get()
        X = [review.to_dict()['Text'] for review in reviews]
        y = [review.to_dict()['Lable'] for review in reviews]

        print("Successfully collected the data")
    except:
        print("Error while retrying the data !")

    try:
        if(len(X)>=1000):
            train_model(X,y,bucket,db)
            print("Model Trained Successfully !")
        else:
            print("The data is not sufficient To train the model")
    except:
        print("Error While training !")

def start(db,bucket):
    retrain_model(db,bucket)