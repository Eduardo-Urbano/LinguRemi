package LinguRemi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired 
	JavaMailSender mailSender;
	
	public void enviarEmailRecuperacao(String destinatario, String token) {
		String link = "http://localhost:8081/resetPassword?token=" + token;
		
		SimpleMailMessage mensagem = new SimpleMailMessage();
		mensagem.setFrom("LinguRémi <linguremi@gmail.com>");
		mensagem.setTo(destinatario);
		mensagem.setSubject("Recuperação de senha - LinguRémi");
		mensagem.setText("Para redefinir sua senha use o link abaixo:\n\n" 
							+ link 
							+ "\nEste link ira expirar em 15 minutos");
		
		mailSender.send(mensagem);
	}
}
