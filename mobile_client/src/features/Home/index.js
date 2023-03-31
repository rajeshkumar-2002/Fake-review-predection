import React from 'react';
import {Text} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Textroute from '../TextRoute';
import Urlroute from '../UrlRoute';

const TextRoute = () => <Textroute />;

const UrlRoute = () => <Urlroute />;

export default function Home({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'text', title: 'Text', focusedIcon: 'text'},
    {key: 'url', title: 'Url', focusedIcon: 'link-variant'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    text: TextRoute,
    url: UrlRoute,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
}
