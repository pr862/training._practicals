import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import App from './App';

// Ignore the specific warning about pointerEvents deprecation in React Native Web
// which is triggered by the navigation stack internal components.
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Use style.pointerEvents'
]);

registerRootComponent(App);
