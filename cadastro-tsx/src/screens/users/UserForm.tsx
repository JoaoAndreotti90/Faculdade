import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'; // Importar hooks
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Para tipagem da navegação
import { authorizedFetch } from '../../api/authApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User } from '../../contexts/AuthContext'; // Importar tipo User
// Importar a lista de parâmetros da Stack de Usuários (precisa ser criada ou ajustada)
// Exemplo: export type UsersStackParamList = { UserList: undefined; UserForm: { usuario?: User } };
// import { UsersStackParamList } from './UsersScreen'; 

// Definir tipo para a rota e navegação
// Ajuste 'UsersStackParamList' e 'UserForm' conforme sua estrutura de navegação
type UserFormRouteProp = RouteProp<{ UserForm: { usuario?: User } }, 'UserForm'>;
type UserFormNavigationProp = NativeStackNavigationProp<any>; // Use 'any' por simplicidade ou defina a StackParamList

export function UserForm() {
  const route = useRoute<UserFormRouteProp>();
  const navigation = useNavigation<UserFormNavigationProp>();
  const usuarioParaEditar = route.params?.usuario; // Pega o usuário passado por parâmetro

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState(''); // Senha vazia por padrão na edição
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (usuarioParaEditar) {
      setIsEditing(true);
      setLogin(usuarioParaEditar.login);
      // Não preenchemos a senha para edição por segurança
      // O usuário digita uma nova senha se quiser alterar
    } else {
      setIsEditing(false);
      setLogin('');
      setSenha('');
    }
  }, [usuarioParaEditar]);

  const handleSubmit = async () => {
    if (!login) {
      Alert.alert('Erro', 'O campo Login é obrigatório.');
      return;
    }
    // Senha só é obrigatória no cadastro
    if (!isEditing && !senha) {
        Alert.alert('Erro', 'O campo Senha é obrigatório para cadastro.');
        return;
    }

    const url = isEditing 
      ? `http://localhost:3000/usuarios/${usuarioParaEditar?.id}` 
      : 'http://localhost:3000/usuarios';
      
    const method = isEditing ? 'PUT' : 'POST';

    const body: { login: string; senha?: string } = { login };
    // Só envia a senha se ela foi digitada (para cadastro ou para alteração)
    if (senha) {
        body.senha = senha;
    }

    try {
      const resp = await authorizedFetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' }, // OK para JSON
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.erro || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'}`);
      }

      Alert.alert('Sucesso', `Usuário ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`);
      
      // Limpar campos e voltar para a lista
      setLogin('');
      setSenha('');
      navigation.goBack(); // Volta para a tela anterior (UserList)

    } catch (err: any) {
      Alert.alert('Erro', err.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'}`);
    }
  };

  return (
    <View style={{ padding: 15 }}> 
      <Input 
        placeholder="Login" 
        value={login} 
        onChangeText={setLogin} 
        autoCapitalize="none" 
      />
      <Input 
        placeholder={isEditing ? "Nova Senha (deixe em branco para não alterar)" : "Senha"} 
        value={senha} 
        onChangeText={setSenha} 
        secureTextEntry 
      />
      <Button 
        title={isEditing ? "Atualizar Usuário" : "Cadastrar Usuário"} 
        onPress={handleSubmit} 
      />
    </View>
  );
}

