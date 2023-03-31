import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TextInput, Button, Card, Text, DataTable} from 'react-native-paper';
import {styles} from './styles';
import axios from 'axios';

export default function Textroute() {
  const [review, setReview] = useState('');

  const [sum, setSum] = useState();
  const [result, setResult] = useState();
  const [words, setWords] = useState({});
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    const data = {review: review};
    axios
      .post('http://192.168.244.26:5000/predict', data)
      .then(function (response) {
        console.log(response.data);
        setSum(response.data.Data.Highlighted_text_sum);
        setResult(response.data.Data.result);
        if (Object.keys(response.data.Data.words).length !== 0) {
          setWords(response.data.Data.words);
        }
        setError(false);
      })
      .catch(error => {
        setSum('');
        setResult('');
        setWords('');
        console.log(error);
        setError(true);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title_}>
          Fake Review Prediction
        </Text>
        <View style={styles.form_content}>
          <TextInput
            label="Enter review"
            value={review}
            onChangeText={e => setReview(e)}
            numberOfLines={10}
            multiline={true}
            mode="outlined"
            style={{maxHeight: 200}}
          />
          <Button
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            disabled={!Boolean(review)}>
            Predict
          </Button>
        </View>
        <View>
          {!error && sum && result && words && (
            <View style={{marginTop: 20, marginBottom: 20}}>
              <Card>
                <Card.Content style={{flexDirection: 'column', gap: 10}}>
                  <Text variant="bodyLarge">
                    <Text style={{fontWeight: 'bold'}}> Result : </Text>
                    {result === 1 ? (
                      <Text style={{color: 'red'}}>
                        The given Review is{' '}
                        <Text style={{fontWeight: 'bold', color: 'red'}}>
                          Fake
                        </Text>{' '}
                        Review
                      </Text>
                    ) : (
                      <Text style={{color: 'green'}}>
                        The given Review is{' '}
                        <Text style={{fontWeight: 'bold', color: 'green'}}>
                          Genuine
                        </Text>{' '}
                        Review
                      </Text>
                    )}
                  </Text>
                  <Text variant="bodyLarge">
                    <Text style={{fontWeight: 'bold'}}>
                      Highlighted text sum :
                    </Text>{' '}
                    {sum}
                  </Text>
                  <View style={{margin: 10}}>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>
                          <Text
                            style={{fontWeight: 'bold'}}
                            variant="titleSmall">
                            Word
                          </Text>
                        </DataTable.Title>
                        <DataTable.Title>
                          <Text
                            style={{fontWeight: 'bold'}}
                            variant="titleSmall">
                            Weight
                          </Text>
                        </DataTable.Title>
                      </DataTable.Header>
                      {Object.keys(words).length !== 0 &&
                        Object.entries(words).map(([key, value]) => (
                          <DataTable.Row key={key}>
                            <DataTable.Cell>{key}</DataTable.Cell>
                            <DataTable.Cell>{value.toFixed(3)}</DataTable.Cell>
                          </DataTable.Row>
                        ))}
                    </DataTable>
                  </View>
                </Card.Content>
              </Card>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
