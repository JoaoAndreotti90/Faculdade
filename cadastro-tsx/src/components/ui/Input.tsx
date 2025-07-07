import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';


interface InputProps extends TextInputProps {

}

export const Input: React.FC<InputProps> = ({ style, ...props }) => (
  <TextInput
    style={[styles.input, style]} 
    placeholderTextColor="#888" 
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
  },
});
