package br.unesp.backend.app.controller;

import br.unesp.backend.app.dtos.auth.AuthenticationDTO;
import br.unesp.backend.app.dtos.auth.LoginResponseDTO;
import br.unesp.backend.app.dtos.auth.RegisterDTO;
import br.unesp.backend.model.entities.Person;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.repositories.UsuarioRepository;
import br.unesp.backend.app.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data){

        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());

        try{
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var token = tokenService.generateToken((Usuario) auth.getPrincipal());

            return ResponseEntity.ok(new LoginResponseDTO(token));
        }catch(Exception e){
            System.out.println("Erro:  ");
            System.out.println(e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){

        if(this.usuarioRepository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        System.out.println(data.login());
        System.out.println(encryptedPassword);
        System.out.println(data.role());

        Usuario newUser = new Person(data.login(), encryptedPassword, data.role(), "teste", "teste");

        this.usuarioRepository.save(newUser);

        return ResponseEntity.ok().build();
    }
}