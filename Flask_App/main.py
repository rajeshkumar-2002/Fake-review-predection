import csv
import time

def start(Db):
   db = Db
   try:
      with open('./static/data/Review.csv', 'r') as file:
         reader = csv.reader(file)
         headers = next(reader) 
         count = 0

         try:
            for row in reader:
               doc_ref = db.collection("review").document()
               time.sleep(1)
               doc_ref.set({headers[i]: row[i] for i in range(len(headers))})
               count+=1
               print(count)
            print("Data uploaded to Firestore successfully!")
         except:
            print("Error while uploading !")

   except:
      print("Error While Geting the data !")