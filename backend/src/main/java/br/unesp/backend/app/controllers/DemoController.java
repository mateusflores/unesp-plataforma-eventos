package br.unesp.backend.app.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @PostMapping("/demo/reset")
    public ResponseEntity<Void> reset() {
        return ResponseEntity.noContent().build();
    }
}
