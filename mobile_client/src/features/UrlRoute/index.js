import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  DataTable,
  List,
} from 'react-native-paper';
import {styles} from './styles';
import axios from 'axios';

export default function Urlroute() {
  const [url, setUrl] = useState('');

  const [data, setData] = useState();
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const data = {url: url};
    axios
      .post('http://192.168.244.26:5000/appurl', data)
      .then(function (response) {
        setData(response.data.reviews);
        setError(false);
      })
      .catch(error => {
        setError(true);
      });
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title_}>
          Fake Review Prediction
        </Text>
        <View style={styles.form_content}>
          <TextInput
            mode="outlined"
            label="Enter url"
            placeholder="https://www.flipkart.com"
            value={url}
            onChangeText={e => setUrl(e)}
          />
          <Button
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            disabled={!Boolean(url)}>
            Predict
          </Button>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data ? (
            !error ? (
              <View>
                {data.map((review, index) => (
                  <View key={index} style={{marginTop: 10, marginBottom: 10}}>
                    <Card>
                      <Card.Content
                        style={{
                          flexDirection: 'column',
                          gap: 10,
                        }}>
                        <Text variant="titleLarge">{review.title}</Text>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                          }}>
                          <Text>
                            Rating :{' '}
                            {review.rating >= 3 ? (
                              <Text style={{color: 'green'}}>
                                {review.rating}
                              </Text>
                            ) : (
                              <Text style={{color: 'red'}}>
                                {review.rating}
                              </Text>
                            )}
                          </Text>
                          <Text>
                            {review.data.result === 1 ? (
                              <Text style={{color: 'red'}}>Fake</Text>
                            ) : (
                              <Text style={{color: 'green'}}>Genuine</Text>
                            )}
                          </Text>
                        </View>
                        <Text variant="bodyMedium">
                          {review.text.replace('READ MORE', '...')}
                        </Text>

                        <List.Accordion
                          title="More info" style={{backgroundColor:"#F8F3F9"}}>
                          <List.Item
                            title={
                              <View>
                                <Text
                                  variant="bodyLarge"
                                  style={{marginBottom: 15}}>
                                  <Text style={{fontWeight: 'bold'}}>
                                    Highlighted text sum :
                                  </Text>{' '}
                                  {review.data.Highlighted_text_sum}
                                </Text>
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
                                  {Object.keys(review.data.words).length !==
                                    0 &&
                                    Object.entries(review.data.words).map(
                                      ([key, value]) => (
                                        <DataTable.Row key={key}>
                                          <DataTable.Cell>{key}</DataTable.Cell>
                                          <DataTable.Cell>
                                            {value.toFixed(3)}
                                          </DataTable.Cell>
                                        </DataTable.Row>
                                      ),
                                    )}
                                </DataTable>
                              </View>
                            }
                          />
                        </List.Accordion>
                      </Card.Content>
                    </Card>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text>Error</Text>
              </View>
            )
          ) : (
            <View></View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
