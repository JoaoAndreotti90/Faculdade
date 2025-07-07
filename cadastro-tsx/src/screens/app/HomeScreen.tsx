// HomeScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { globalStyles } from '../../styles/globalStyles'; 
import { Button } from '../../components/ui/Button';

// Removido NativeStackScreenProps e AppStackParamList pois a navegação principal agora é por Tabs
// A navegação para Users/Clients será feita pelas Tabs, não por botões aqui.

export const HomeScreen = () => { // Removido { navigation } das props
  const auth = useContext(AuthContext);
  const { userData } = auth?.state || {};

  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo, {userData?.login ?? 'Usuário'}</Text>
      
      {/* Removidos os botões de navegação para Usuários e Clientes */}
      {/* A navegação agora é feita pelas Bottom Tabs */}

      {/* Botão Sobre o Time */}
      <Button 
        title="Sobre o Time de Desenvolvimento" 
        onPress={() => setIsTeamModalVisible(true)} 
      />
      <Button 
        title="Logout" 
        onPress={auth?.signOut ?? (() => { console.warn('Função signOut não disponível'); })}
        color="red" 
      />

      {/* Modal Sobre o Time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTeamModalVisible}
        onRequestClose={() => {
          setIsTeamModalVisible(!isTeamModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Time de Desenvolvimento</Text>
            <Text style={styles.modalText}>Gustavo de Carvalho Vieira - RA: 51806</Text>
            <Text style={styles.modalText}>João Gilberto Andreotti Neto - RA: 51758</Text>
            <Pressable
              style={[styles.modalButton, styles.modalButtonClose]}
              onPress={() => setIsTeamModalVisible(!isTeamModalVisible)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos para o modal (mantidos)
const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 15, 
  },
  modalButtonClose: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

