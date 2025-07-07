import React, { useContext, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { globalStyles } from '../../styles/globalStyles';
import { AuthContext } from '../../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = ({ navigation }: Props) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const auth = useContext(AuthContext);

  const handleSignUp = async () => {
    if (senha !== confirmar) return Alert.alert('Erro', 'Senhas diferentes');
    await auth?.signUp(login, senha);
    navigation.goBack(); // <- funciona agora
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Cadastro</Text>
      <Input placeholder="Login" value={login} onChangeText={setLogin} />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Input placeholder="Confirmar" value={confirmar} onChangeText={setConfirmar} secureTextEntry />
      <Button title="Cadastrar" onPress={handleSignUp} />
    </View>
  );
};
