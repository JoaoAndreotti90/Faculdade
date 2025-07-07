import React, { useState, useEffect } from 'react';
import { Alert, View, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { authorizedFetch } from '../../api/authApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Client } from '../../types'; // Importar tipo Client

// Definir tipo para a rota e navegação (ajuste conforme sua estrutura)
type ClientFormRouteProp = RouteProp<{ ClientForm: { cliente?: Client } }, 'ClientForm'>;
type ClientFormNavigationProp = NativeStackNavigationProp<any>; // Use 'any' ou defina a StackParamList

export function ClientForm() {
  const route = useRoute<ClientFormRouteProp>();
  const navigation = useNavigation<ClientFormNavigationProp>();
  const clienteParaEditar = route.params?.cliente;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [foto, setFoto] = useState<ImagePicker.ImagePickerAsset | null>(null); // Armazena o asset da nova foto
  const [fotoAntigaUri, setFotoAntigaUri] = useState<string | null>(null); // Armazena URI da foto existente
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (clienteParaEditar) {
      setIsEditing(true);
      setNome(clienteParaEditar.nome);
      setEmail(clienteParaEditar.email);
      setTelefone(clienteParaEditar.telefone || '');
      setEndereco(clienteParaEditar.endereco);
      // Ajuste para construir URI completa se necessário
      const baseUrl = 'http://localhost:3000'; // Defina a base URL da sua API
      setFotoAntigaUri(clienteParaEditar.foto_fachada_caminho ? `${baseUrl}${clienteParaEditar.foto_fachada_caminho}` : null);
      setFoto(null);
    } else {
      setIsEditing(false);
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setFoto(null);
      setFotoAntigaUri(null);
    }
  }, [clienteParaEditar]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para selecionar uma foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFoto(result.assets[0]);
      setFotoAntigaUri(null);
    }
  };

  const handleSubmit = async () => {
    if (!nome || !email || !endereco) {
      Alert.alert('Erro', 'Nome, Email e Endereço são obrigatórios.');
      return;
    }

    let latitude: number | string | null = null;
    let longitude: number | string | null = null;

    if (!isEditing) {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Permissão de localização é necessária para cadastrar.');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
        } catch (error) {
            Alert.alert('Erro de Localização', 'Não foi possível obter a localização.');
            return;
        }
    } else {
        latitude = clienteParaEditar?.latitude ?? null;
        longitude = clienteParaEditar?.longitude ?? null;
        if (latitude === null || longitude === null) {
             Alert.alert('Erro', 'Localização original não encontrada para edição.');
             return;
        }
    }

    const form = new FormData();
    form.append('nome', nome);
    form.append('email', email);
    form.append('telefone', telefone);
    form.append('endereco', endereco);
    form.append('latitude', String(latitude));
    form.append('longitude', String(longitude));

    if (foto && foto.uri) {
      const uriParts = foto.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = foto.fileName || `foto_${Date.now()}.${fileType}`;
      const mimeType = foto.mimeType || `image/${fileType}`;

      form.append('foto', {
        uri: foto.uri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    const url = isEditing
      ? `http://localhost:3000/clientes/${clienteParaEditar?.id}`
      : 'http://localhost:3000/clientes';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const resp = await authorizedFetch(url, {
        method: method,
        body: form,
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ erro: 'Erro desconhecido ao processar resposta.' }));
        throw new Error(errorData.erro || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} cliente`);
      }

      Alert.alert('Sucesso', `Cliente ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`);
      
      setNome(''); setEmail(''); setTelefone(''); setEndereco(''); setFoto(null); setFotoAntigaUri(null);
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Erro', err.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} cliente`);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      
      {(fotoAntigaUri || foto?.uri) && (
          <Image 
            source={{ uri: foto?.uri ?? fotoAntigaUri ?? undefined }} 
            style={styles.imagePreview} 
          />
      )}

      <Button title={fotoAntigaUri || foto ? "Alterar Foto" : "Selecionar Foto"} onPress={handlePickImage} />
      
      <Button title={isEditing ? "Atualizar Cliente" : "Cadastrar Cliente"} onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 15,
        paddingBottom: 30,
    },
    imagePreview: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    }
});

