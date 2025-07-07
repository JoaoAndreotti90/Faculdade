import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/app/HomeScreen';
import { ClientsScreen } from '../screens/clients/ClientsScreen';
import { UsersScreen } from '../screens/users/UsersScreen';

// 1. Usar createBottomTabNavigator em vez de createNativeStackNavigator
const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    // 2. Configurar o Tab.Navigator
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Oculta o header padrão do Tab, pois as Stacks internas (Clients/Users) terão seus próprios headers
      }}
    >
      {/* 3. Adicionar as Tabs */}
      <Tab.Screen 
        name="HomeTab" // Nome único para a rota da Tab
        component={HomeScreen} 
        options={{ title: 'Início' }} // Título que aparece na Tab
      />
      <Tab.Screen 
        name="ClientsTab" // Nome único para a rota da Tab
        component={ClientsScreen} 
        options={{ title: 'Clientes' }} // Título que aparece na Tab
      />
      <Tab.Screen 
        name="UsersTab" // Nome único para a rota da Tab
        component={UsersScreen} 
        options={{ title: 'Usuários' }} // Título que aparece na Tab
      />
    </Tab.Navigator>
  );
}

