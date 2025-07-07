import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/UseAuth';
import { SplashScreen } from '../screens/app/SplashScreen';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { state } = useAuth();

  if (state.isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {state.userToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}