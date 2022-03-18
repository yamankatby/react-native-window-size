import React from 'react';
import { Text } from 'react-native';
import { Provider, useWindowSize } from 'react-native-window-size';

const App = () => {
  const windowSize = useWindowSize();
  return (
    <Text
      style={{
        marginTop: windowSize({ mobile: 20, desktop: 50 }),
        backgroundColor: windowSize({ mobile: 'red', tablet: 'green' }),
      }}
    >
      Hello, world!
    </Text>
  );
};

export default function AppProvider() {
  return (
    <Provider windowSizes={{ mobile: 0, tablet: 720, desktop: 1200 }}>
      <App />
    </Provider>
  );
}
