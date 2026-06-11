import 'react-native-gesture-handler'

import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'

import { resetPassword } from '@/src/services/authService'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {token} = useLocalSearchParams()


    async function handleResetPassword() {
        if (isLoading) return
        
        setErrorMessage('')

        const sanitizedPassword = password.trim()
        const sanitizedPassword2 = password2.trim()

        if (!sanitizedPassword2 || !sanitizedPassword ) {
            setErrorMessage('Preencha todos os campos.')
            return
        }

        try{
            setIsLoading(true)

            await resetPassword({
                token: String(token),
                novaSenha:sanitizedPassword,
                confirmarSenha:sanitizedPassword2,
            })

            setErrorMessage(
                'Enviamos as instruções de recuperação para o seu e-mail.'
            )
        } catch (error) {
            const message = 
                error instanceof Error
                ? error.message
                : 'Erro ao solicitar recuperação de senha.'

                setErrorMessage(message)
        } finally{
            setIsLoading(false)
        }
}

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Esqueci Minha Senha</Text>

                {errorMessage ? (
                    <Text style={styles.error}>{errorMessage}</Text>
                ) : null}

                {successMessage ? (
                    <Text style={styles.sucess}>{successMessage}</Text>
                ) : null}

                <TextInput
                    placeholder="Nova senha"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    placeholder="Nova senha"
                    value={password2}
                    onChangeText={setPassword2}
                    autoCapitalize="none"
                    secureTextEntry
                    style={styles.input}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Aguarde...' : 'Trocar senha'}
                    </Text>
                </Pressable>

            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf7f2',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        elevation: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    sucess: {
        backgroundColor: '#80c684',
        color: '#991b1b',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
})