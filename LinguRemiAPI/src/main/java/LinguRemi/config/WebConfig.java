package LinguRemi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia qualquer URL que comece com /uploads/ para a pasta real no servidor
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/"); // caminho relativo à raiz do projeto
    }
}