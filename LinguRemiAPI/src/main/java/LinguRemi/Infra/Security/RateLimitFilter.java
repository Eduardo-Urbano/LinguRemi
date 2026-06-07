package LinguRemi.Infra.Security;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import LinguRemi.Infra.Exception.RateLimitException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final Map<String, RequestData> requests = new ConcurrentHashMap<>();

    private static final Logger logger =
            LoggerFactory.getLogger(RateLimitFilter.class);
    private static final int MAX_REQUESTS = 30;
    private static final long WINDOW_TIME = 60000;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        logger.info("[RATE LIMIT FILTER] Executando");
        String ip = request.getRemoteAddr();

        RequestData data = requests.get(ip);

        if (data == null) {
            data = new RequestData();
            requests.put(ip, data);
        } else {

            long currentTime = System.currentTimeMillis();

            if (currentTime - data.getFirstRequestTime() > WINDOW_TIME) {
                data.reset();
            }else {
                data.increment();
            }
        }

        logger.info(
                "[RATE LIMIT] IP {} | Requisições {}",
                ip,
                data.getCount()
        );

        if (data.getCount() > MAX_REQUESTS) {

            logger.warn("[RATE LIMIT] IP {} bloqueado após {} requisições",
                    ip,
                    data.getCount()
            );

            response.setStatus(429);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write("""
            {
                "status": 429,
                "error": "RATE_LIMIT_EXCEEDED",
                "message": "Muitas requisições. Tente novamente mais tarde."
            }
            """);

            return;
        }

        filterChain.doFilter(request, response);
    }
}