import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export default function CadastroScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = () => {
    if (senha !== confirmarSenha) {
      console.log('As senhas não coincidem');
      return;
    }
    console.log('Nome:', nome, 'Email:', email, 'Senha:', senha);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.text}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cadastroText}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center' },
  text: { color: '#fff', fontSize: 16 },
  cadastroText: { color: '#4CAF50', fontSize: 14, marginTop: 16, textAlign: 'center' },
});
