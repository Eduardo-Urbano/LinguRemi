package LinguRemi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.Map;

@Tag(name = "Health", description = "Endpoints de status da API")
@RestController
public class HealthController {

    @Operation(summary = "Incialização da API")
    @GetMapping("/")
    public String home() {
        return "LinguRemi API online!";
    }

    @Operation(summary = "Verifica se a API está online")
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "ok",
                "service", "LinguRemi API"
        );
    }
}