import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Linking,
} from 'react-native';
import {Card, Text, DataTable} from 'react-native-paper';
import axios from 'axios';

export default function Profile() {
  const [what, setwhat] = useState(true);
  const [link, setlink] = useState(true);

  return (
    <ScrollView>
      <View style={{marginTop: 15, marginBottom: 20}}>
        <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>
          Fake Review Prediction using ML
        </Text>
        <View style={{marginLeft: 10, paddingTop: 40}}>
          <TouchableWithoutFeedback
            onPress={() => {
              setwhat(!what);
            }}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {' '}
              What is Fake Review Prediction ?
            </Text>
          </TouchableWithoutFeedback>
          <View style={{padding: 15}}>
            {what && (
              <Text style={{textAlign: 'justify'}}>
                Fake review prediction is an important task in the digital era
                where businesses rely heavily on customer feedback to drive
                their sales and reputation. With the rise of e-commerce and
                online platforms, consumers have access to an abundance of
                product and service reviews, which they use as are ference
                before making a purchase. However, not all reviews are genuine,
                and some are written by individuals with the intention of
                manipulating the opinions of potential customers. This is where
                fake review prediction comes in, as it helps identify and remove
                fake reviews that may influence the decision of potential
                customers, and help businesses and websites to maintain the
                integrity of their reviews. The task of fake review prediction
                is typically done using machine learning , which analyze the
                text of reviews and classify them as fake or genuine based on
                various features such as review rating and purchase. With the
                help of these techniques, fake review prediction can improve the
                overall user experience, by providing them with genuine reviews,
                and help businesses to maintain the integrity of their reviews.
              </Text>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              setlink(!link);
            }}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {' '}
              Related Link ...
            </Text>
          </TouchableWithoutFeedback>
          {link && (
            <View style={{padding: 20}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Dataset</Text>
              <View style={{paddingLeft: 20, paddingTop: 20}}>
                <Text style={{fontWeight: 'bold'}}>
                  Source : <Text>Kaggle</Text>
                </Text>
                <Text style={{paddingTop: 10, fontWeight: 'bold'}}>
                  Description :{' '}
                </Text>
                <View style={{paddingLeft: 10}}>
                  <Text style={{textAlign: 'justify'}}>
                    The Amazon reviews dataset consists of reviews from amazon.
                    The data span a period of 18 years, including ~35 million
                    reviews up to March 2013. Reviews include product and user
                    information, ratings, and a plaintext review. For
                    moreinformation, please refer to the following paper: J.
                    McAuley and J. Leskovec.Hidden factors and hidden topics:
                    understanding rating dimensions withreviewtext. RecSys,
                    2013.
                  </Text>
                  <Text style={{textAlign: 'justify', paddingTop: 10}}>
                    The Amazon reviews polarity dataset is constructed by taking
                    review score 1 and 2 as negative, and 4 and 5 as positive.
                    Samples of score 3 is ignored. Inthe dataset, class 1 is the
                    negative and class 2 is the positive.
                  </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10}}>
                  Link :{' '}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Linking.openURL(
                        'https://www.kaggle.com/datasets/kritanjalijain/amazon-reviews',
                      );
                    }}>
                    <Text style={{color: 'blue'}}>Click Here!</Text>
                  </TouchableWithoutFeedback>
                </Text>
              </View>
              <Text style={{fontWeight: 'bold', paddingTop: 25}}>Code</Text>
              <View style={{paddingLeft: 20, paddingTop: 20}}>
                <Text style={{fontWeight: 'bold'}}>
                  Code Location : <Text>GitHub</Text>
                </Text>
                <Text style={{paddingTop: 10, fontWeight: 'bold'}}>
                  Link :{' '}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Linking.openURL(
                        'https://github.com/rajeshkumar-2002/Fake-review-predection',
                      );
                    }}>
                    <Text style={{color: 'blue'}}>Click Here!</Text>
                  </TouchableWithoutFeedback>
                </Text>
              </View>
            </View>
          )}
          <View>
            <Text style={{fontWeight: 'bold', paddingTop: 20}}>
              Information on the Classifier
            </Text>
            <Card style={{width: '90%', marginTop: 20, marginLeft: 15}}>
              <Card.Content style={{flexDirection: 'column', gap: 10}}>
                <View style={{margin: 10}}>
                  <DataTable>
                    <DataTable.Row>
                      <DataTable.Cell>Model</DataTable.Cell>
                      <DataTable.Cell>SVM</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Vectorizer</DataTable.Cell>
                      <DataTable.Cell>TF-IDF</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Test-Tain splitting</DataTable.Cell>
                      <DataTable.Cell>70%-30%</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>
                        Spelling Correction Library
                      </DataTable.Cell>
                      <DataTable.Cell>TextBlob</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Stemmer</DataTable.Cell>
                      <DataTable.Cell>PorterStemmer</DataTable.Cell>
                    </DataTable.Row>
                  </DataTable>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
