package LinguRemi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import LinguRemi.repository.UsuariosRepository;

@Service
public class AuthorizationService implements UserDetailsService{

	@Autowired
	UsuariosRepository repU;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserDetails user = repU.findByEmailUsuarios(username);

		if(user == null){
			throw new UsernameNotFoundException("Usuário não encontrado");
		}

		return user;
	}

}
