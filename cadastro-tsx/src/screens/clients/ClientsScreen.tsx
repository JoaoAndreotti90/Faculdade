import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientList } from './ClientList';
import { ClientForm } from './ClientForm';
// 1. Importar o tipo Client do novo arquivo
import { Client } from '../../types'; 

// Definir os tipos de parâmetros para a Stack interna de Clientes
export type ClientsStackParamList = {
  ClientList: undefined; 
  ClientForm: { cliente?: Client }; // Usar o tipo Client importado
};

const Stack = createNativeStackNavigator<ClientsStackParamList>();

// ClientsScreen agora retorna o Navegador
export function ClientsScreen() {
  return (
    <Stack.Navigator initialRouteName="ClientList">
      <Stack.Screen
        name="ClientList"
        component={ClientList}
        options={{ title: 'Lista de Clientes' }}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={({ route }) => ({
          // Usar o tipo Client importado aqui também
          title: route.params?.cliente ? 'Editar Cliente' : 'Novo Cliente'
        })}
      />
    </Stack.Navigator>
  );
}

