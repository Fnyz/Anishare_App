import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddUpdate from './components/AddUpdate';
import DetailsPage from './components/DetailsPage';
import Home from './components/Home';
import LoginAndSignUp from './components/LoginAndSignUp';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducers from './reducers';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
const store = createStore(rootReducers, compose(applyMiddleware(thunk)))
  

export default function App() {
  return (
    <>
    <Provider store={store}>
    <NavigationContainer>
    <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
      <Stack.Screen name="SignInSignUp" component={LoginAndSignUp} />
      <Stack.Screen name="Home" component={Home} /> 
      <Stack.Screen name="AddUpdate" component={AddUpdate} />   
      <Stack.Screen name="Details" component={DetailsPage} />   
    </Stack.Navigator>
  </NavigationContainer>
     </Provider>
     <Toast />
    </>
 
  );
}

