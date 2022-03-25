import React from 'react';
import { Text } from 'react-native';
import { Provider, useWindowSize } from 'react-native-window-size';

const App = () => {
  const windowSize = useWindowSize();
  return (
    <Text
      style={{
        marginTop: windowSize.value({ mobile: 20, desktop: 50 }),
        backgroundColor: windowSize.value({ mobile: 'red', tablet: 'green' }),
      }}
    >
      {windowSize.down('mobile') && 'true'}
    </Text>
  );
};

export default function AppProvider() {
  return (
    <Provider breakpoints={{ mobile: 0, tablet: 720, desktop: 1200 }}>
      <App />
    </Provider>
  );
}
