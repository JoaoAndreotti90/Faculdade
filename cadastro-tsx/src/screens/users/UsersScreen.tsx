import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { User } from '../../contexts/AuthContext'; // Importar tipo User

// 1. Definir os tipos de parâmetros para a Stack interna de Usuários
export type UsersStackParamList = {
  UserList: undefined; // Tela de lista não recebe parâmetros
  UserForm: { usuario?: User }; // Tela de formulário pode receber um usuário opcional
};

// 2. Criar o Stack Navigator com os tipos definidos
const Stack = createNativeStackNavigator<UsersStackParamList>();

// 3. UsersScreen agora retorna o Navegador
export function UsersScreen() {
  return (
    <Stack.Navigator initialRouteName="UserList"> 
      <Stack.Screen 
        name="UserList" 
        component={UserList} 
        options={{ title: 'Lista de Usuários' }} // Título para a tela de lista
      />
      <Stack.Screen 
        name="UserForm" 
        component={UserForm} 
        // Título dinâmico baseado se está editando ou criando
        options={({ route }) => ({ 
          title: route.params?.usuario ? 'Editar Usuário' : 'Novo Usuário' 
        })} 
      />
    </Stack.Navigator>
  );
}
