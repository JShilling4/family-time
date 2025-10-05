import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import TimerScreen from '../screens/TimerScreen';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Timer: { timerId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Family Time' }} />
        <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Timer' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




