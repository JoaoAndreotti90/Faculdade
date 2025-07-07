import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles'; 
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';

export const SplashScreen = () => (
  // Uso corrigido aqui:
  <View style={globalStyles.centered}> 
    <LoadingIndicator />
    <Text>Carregando...</Text>
  </View>
);
