import React from 'react';
// import RootRouter from './src/Router';
import { LogBox ,SafeAreaView,Text, TextInput, View } from 'react-native';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import BleScreen from './Screen/BleScreen';
import BleManager from "react-native-ble-manager"


class App extends React.Component {

  componentDidMount() {
    BleManager.start({ showAlert: false })
    .then(() => {
        // Success code
        console.log('Module initialized');
    })
    .catch((err) => {
        console.log(`Module initialization failed: ${err}`);
    });
  }

  render() {
  
    Text.defaultProps = Text.defaultProps || {}
    Text.defaultProps.allowFontScaling = false

    TextInput.defaultProps = Text.defaultProps || {}
    TextInput.defaultProps.allowFontScaling = false

    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.']);
    LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell']);
    LogBox.ignoreLogs(['source.uri should not be an empty string']);

    
    return (
      <BleScreen/>
    );
  }

}

export default App;