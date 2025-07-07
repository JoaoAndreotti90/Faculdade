import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal, // Importar Modal
  Pressable, // Importar Pressable para botões do modal
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersStackParamList } from './UsersScreen';

import { authorizedFetch } from '../../api/authApi';
import { globalStyles } from '../../styles/globalStyles';
import { Button } from '../../components/ui/Button';
import { User } from '../../contexts/AuthContext';

type UserListNavigationProp = NativeStackNavigationProp<UsersStackParamList, 'UserList'>;

export function UserList() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const navigation = useNavigation<UserListNavigationProp>();

  // --- Estados para o Modal de Confirmação ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  // -------------------------------------------

  const carregarUsuarios = useCallback(async () => {
    try {
      const apiUrl = 'http://localhost:3000';
      const resp = await authorizedFetch(`${apiUrl}/usuarios`);
      if (!resp.ok) {
        throw new Error('Falha ao carregar usuários');
      }
      const data: User[] = await resp.json();
      setUsuarios(data);
    } catch (error: any) {
      // Evitar Alert aqui para não conflitar com o modal
      console.error('Erro ao carregar usuários:', error.message || error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [carregarUsuarios])
  );

  const handleEdit = (usuario: User) => {
    navigation.navigate('UserForm', { usuario: usuario });
  };

  // --- Modificado para abrir o Modal ---
  const handleDelete = (usuarioId: number) => {
    console.log("handleDelete chamado com ID:", usuarioId);
    setUserToDeleteId(usuarioId); // Guarda o ID do usuário a ser excluído
    setIsModalVisible(true); // Abre o modal
  };
  // -------------------------------------

  // --- Função para confirmar a exclusão (chamada pelo Modal) ---
  const confirmDelete = async () => {
    if (userToDeleteId === null) return;

    console.log(`[confirmDelete] Tentando excluir usuário ID: ${userToDeleteId}`);
    try {
      const apiUrl = 'http://localhost:3000';
      const resp = await authorizedFetch(`${apiUrl}/usuarios/${userToDeleteId}`, {
        method: 'DELETE',
      });
      console.log(`[confirmDelete] Resposta da API recebida. Status: ${resp.status}`);

      if (!resp.ok) {
        let errorData = { erro: `Erro ${resp.status} ao excluir usuário` };
        try {
          if (resp.headers.get('content-length') !== '0' && resp.status !== 204) {
            errorData = await resp.json();
            console.error(`[confirmDelete] Erro da API (status ${resp.status}):`, errorData);
          } else {
            console.warn(`[confirmDelete] Resposta não OK (status ${resp.status}) sem corpo JSON.`);
          }
        } catch (parseError) {
          console.error(`[confirmDelete] Erro ao parsear resposta de erro da API (status ${resp.status}):`, parseError);
        }
        throw new Error(errorData.erro || `Erro ${resp.status} ao excluir usuário`);
      }

      console.log("[confirmDelete] Exclusão bem-sucedida (status 2xx).");
      // Fechar modal e limpar ID ANTES de recarregar
      setIsModalVisible(false);
      setUserToDeleteId(null);
      // Usar um pequeno delay pode ajudar a UI a atualizar antes do recarregamento
      setTimeout(() => {
        carregarUsuarios(); // Recarregar a lista
        // Poderia mostrar um Toast/Snackbar de sucesso aqui em vez de Alert
      }, 100); 

    } catch (error: any) {
      console.error("[confirmDelete] Erro no bloco catch:", error);
      // Mostrar erro para o usuário (talvez com um Toast/Snackbar)
      setIsModalVisible(false); // Fecha o modal mesmo em caso de erro
      setUserToDeleteId(null);
    }
  };
  // -----------------------------------------------------------

  // --- Função para cancelar a exclusão (chamada pelo Modal) ---
  const cancelDelete = () => {
    setIsModalVisible(false);
    setUserToDeleteId(null);
  };
  // -----------------------------------------------------------

  return (
    <View style={styles.container}> {/* Usar View em vez de ScrollView aqui se o Modal for filho direto */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {usuarios.length === 0 && (
          <Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text>
        )}
        {usuarios.map((usuario) => (
          <View key={usuario.id} style={styles.userItem}>
            <Text style={styles.userLogin}>{usuario.login}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Editar" onPress={() => handleEdit(usuario)} />
              <Button title="Excluir" onPress={() => handleDelete(usuario.id)} color="red" />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- Modal de Confirmação --- */}
      <Modal
        animationType="fade" // ou "slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={cancelDelete} // Permite fechar com botão voltar (Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir este usuário?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Confirmar Exclusão</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* -------------------------- */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Para o Modal Overlay funcionar corretamente
  },
  scrollContentContainer: {
    paddingBottom: 20, // Espaço no final da lista
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userLogin: {
    fontSize: 16,
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
  // --- Estilos do Modal ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
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
    width: '80%', // Largura do modal
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaçar botões
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    minWidth: 100, // Largura mínima
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#ccc', // Cinza para cancelar
  },
  modalButtonConfirm: {
    backgroundColor: '#dc3545', // Vermelho para confirmar exclusão
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // -----------------------
});

