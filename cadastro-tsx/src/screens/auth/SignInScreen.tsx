import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { globalStyles } from '../../styles/globalStyles';
import { AuthContext } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export const SignInScreen = ({ navigation }: Props) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const auth = useContext(AuthContext);

  if (!auth) return <Text>Erro: contexto não encontrado</Text>;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>
      <Input placeholder="Login" value={login} onChangeText={setLogin} />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Entrar" onPress={() => auth.signIn(login, senha)} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={globalStyles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};