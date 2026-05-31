import 'react-native-gesture-handler'

import { router } from 'expo-router'
import { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
} from 'react-native'

import { HeaderLogo } from '../assets/components/HeaderLogo'


export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    async function handleRecover() {
        if (isLoading) return
        
        setErrorMessage('')

        const sanitizedEmail = email.trim()

        if (!sanitizedEmail) {
            setErrorMessage('Preencha todos os campos.')
            return
        }

        if (!emailRegex.test(sanitizedEmail)) {
            setErrorMessage('Insira um email válido.')
            return
        }

        
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Resetar Senha</Text>

                {errorMessage ? (
                    <Text style={styles.error}>{errorMessage}</Text>
                ) : null}

                <TextInput
                    placeholder="Seu Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleRecover}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Entrando...' : 'Solicitar troca de senha'}
                    </Text>
                </Pressable>

            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
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
})