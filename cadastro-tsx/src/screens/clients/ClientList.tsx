import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  TextInput // Importar TextInput
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClientsStackParamList } from './ClientsScreen'; 
import { authorizedFetch } from '../../api/authApi';
import { globalStyles } from '../../styles/globalStyles';
import { Button } from '../../components/ui/Button';
import { Client } from '../../types';
import { Input } from '../../components/ui/Input'; // Importar Input se for usar o componente customizado

type ClientListNavigationProp = NativeStackNavigationProp<ClientsStackParamList, 'ClientList'>;

export function ClientList() {
  const [clientes, setClientes] = useState<Client[]>([]); 
  const [searchedClient, setSearchedClient] = useState<Client | null>(null); // Estado para cliente buscado
  const [searchId, setSearchId] = useState<string>(''); // Estado para o ID de busca
  const navigation = useNavigation<ClientListNavigationProp>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState<number | null>(null);

  const carregarClientes = useCallback(async () => {
    setSearchedClient(null); // Limpa busca ao carregar todos
    setSearchId(''); // Limpa campo de busca
    try {
      const apiUrl = 'http://localhost:3000';
      const resp = await authorizedFetch(`${apiUrl}/clientes`); 
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.erro || 'Falha ao carregar clientes');
      }
      const data: Client[] = await resp.json(); 
      setClientes(data);
    } catch (error: any) {
      console.error("[ClientList] Erro ao carregar clientes:", error);
      Alert.alert('Erro', error.message || 'Não foi possível buscar os clientes.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarClientes(); // Carrega todos ao focar na tela
    }, [carregarClientes])
  );

  const handleEdit = (cliente: Client) => { 
    navigation.navigate('ClientForm', { cliente: cliente });
  };

  const handleAddNewClient = () => {
    navigation.navigate('ClientForm', { cliente: undefined }); 
  };

  const handleDelete = (clienteId: number) => {
    setClientToDeleteId(clienteId);
    setIsDeleteModalVisible(true);
  };

  // *** ADICIONADO: Função para buscar cliente por ID ***
  const handleSearchById = async () => {
    if (!searchId || isNaN(parseInt(searchId))) {
      Alert.alert('Erro', 'Por favor, insira um ID numérico válido.');
      return;
    }
    try {
      const apiUrl = 'http://localhost:3000';
      const resp = await authorizedFetch(`${apiUrl}/clientes/${searchId}`);
      if (resp.status === 404) {
        Alert.alert('Não encontrado', `Nenhum cliente encontrado com o ID ${searchId}.`);
        setSearchedClient(null);
        setClientes([]); // Limpa a lista principal também ou decide como mostrar
        return;
      }
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.erro || `Erro ${resp.status} ao buscar cliente.`);
      }
      const data: Client = await resp.json();
      setSearchedClient(data); // Armazena o cliente encontrado
      setClientes([]); // Limpa a lista principal para mostrar só o buscado
    } catch (error: any) {
      console.error("[ClientList] Erro ao buscar cliente por ID:", error);
      Alert.alert('Erro', error.message || 'Não foi possível buscar o cliente.');
      setSearchedClient(null);
    }
  };

  const confirmDelete = async () => {
    if (clientToDeleteId === null) return;
    try {
      const apiUrl = 'http://localhost:3000';
      const resp = await authorizedFetch(`${apiUrl}/clientes/${clientToDeleteId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.erro || `Erro ${resp.status} ao excluir cliente`);
      }
      setIsDeleteModalVisible(false);
      setClientToDeleteId(null);
      // Se um cliente foi buscado, limpa a busca após deletar
      if (searchedClient && searchedClient.id === clientToDeleteId) {
        setSearchedClient(null);
      }
      carregarClientes(); // Recarrega a lista após exclusão
    } catch (error: any) {
      console.error("[ClientList] Erro ao excluir cliente:", error);
      setIsDeleteModalVisible(false);
      setClientToDeleteId(null);
      Alert.alert('Erro', error.message || 'Não foi possível excluir o cliente.');
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setClientToDeleteId(null);
  };

  // Componente para renderizar um único item de cliente (reutilizável)
  const renderClientItem = (cliente: Client) => (
    <View key={cliente.id} style={styles.clientItem}>
      {cliente.foto_fachada_caminho && (
        <Image 
          source={{ uri: `http://localhost:3000${cliente.foto_fachada_caminho.startsWith('/') ? '' : '/'}${cliente.foto_fachada_caminho.replace(/\\/g, '/')}` }} 
          style={styles.clientImage} 
          resizeMode="cover"
          onError={(e) => console.log("[ClientList] Erro ao carregar imagem do cliente:", e.nativeEvent.error)}
        />
      )}
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{cliente.nome} (ID: {cliente.id})</Text>
        <Text>{cliente.email}</Text>
        <Text>{cliente.telefone}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEdit(cliente)} /> 
        <Button title="Excluir" onPress={() => handleDelete(cliente.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}> 
        {/* Botão Cadastrar */}
        <View style={styles.addButtonContainer}>
          <Button title="Cadastrar Novo Cliente" onPress={handleAddNewClient} />
        </View>

        {/* Área de Busca por ID */}
        <View style={styles.searchContainer}>
          <Input 
            placeholder="Buscar Cliente por ID" 
            value={searchId} 
            onChangeText={setSearchId} 
            keyboardType="numeric" 
            style={styles.searchInput} // Estilo customizado se necessário
          />
          <Button title="Buscar" onPress={handleSearchById} />
          {/* Botão para limpar busca e mostrar todos */}
          {(searchedClient || clientes.length === 0 && !searchedClient) && (
             <Button title="Mostrar Todos" onPress={carregarClientes} color="grey" />
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {searchedClient ? (
          // Mostra apenas o cliente buscado
          renderClientItem(searchedClient)
        ) : clientes.length === 0 ? (
          // Mensagem se a lista principal está vazia (e não há busca ativa)
          <Text style={styles.emptyText}>Nenhum cliente cadastrado ou encontrado.</Text>
        ) : (
          // Mostra a lista completa
          clientes.map(renderClientItem)
        )}
      </ScrollView>

      {/* Modal de confirmação de exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={cancelDelete}
      >
        {/* ... conteúdo do modal ... */}
         <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir este cliente?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDelete}
              ><Text style={styles.modalButtonText}>Cancelar</Text></Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmDelete}
              ><Text style={styles.modalButtonText}>Confirmar Exclusão</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: { // Container para agrupar botões e busca
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5, // Menos padding inferior
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButtonContainer: {
    marginBottom: 10, // Espaço abaixo do botão adicionar
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espaço entre input e botões
    marginBottom: 10,
  },
  searchInput: {
    flex: 1, // Faz o input ocupar o espaço disponível
    // Remover padding vertical se estiver usando o componente Input customizado que já tem
    // paddingVertical: 0, 
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  clientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonConfirm: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

