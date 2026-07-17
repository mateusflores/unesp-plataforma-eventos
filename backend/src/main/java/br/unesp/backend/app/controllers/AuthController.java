package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.auth.*;
import br.unesp.backend.app.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<LoginResponse> registrar(@RequestBody RegisterRequest request) {
        LoginResponse response = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/demo")
    public ResponseEntity<LoginResponse> loginDemo(@RequestBody DemoRequest request) {
        LoginResponse response = authService.loginDemo(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(@RequestBody RecuperarSenhaRequest request) {
        authService.recuperarSenha(request.email());
        return ResponseEntity.noContent().build();
    }
}
