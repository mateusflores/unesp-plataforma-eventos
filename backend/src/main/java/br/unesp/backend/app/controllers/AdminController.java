package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.admin.AdminMetricasDTO;
import br.unesp.backend.app.dtos.usuario.UsuarioDTO;
import br.unesp.backend.app.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/usuarios")
    public List<UsuarioDTO> usuarios() {
        return adminService.usuarios();
    }

    @PatchMapping("/usuarios/{id}/alternar")
    public ResponseEntity<UsuarioDTO> alternarUsuarioAtivo(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.alternarUsuarioAtivo(id));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> removerUsuario(@PathVariable Long id) {
        adminService.removerUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metricas")
    public AdminMetricasDTO metricas() {
        return adminService.metricas();
    }
}
