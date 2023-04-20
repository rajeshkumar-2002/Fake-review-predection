import React from 'react';
import {Text} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Textroute from '../TextRoute';
import Urlroute from '../UrlRoute';
import Profile from '../Profile';

const TextRoute = () => <Textroute />;

const UrlRoute = () => <Urlroute />;

const ProfileRoute = () => <Profile />;

export default function Home({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'text', title: 'Text', focusedIcon: 'text'},
    {key: 'url', title: 'Url', focusedIcon: 'link-variant'},
    {key: 'profile', title: 'Info', focusedIcon: 'information'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    text: TextRoute,
    url: UrlRoute,
    profile: ProfileRoute,
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
