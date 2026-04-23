package com.smarthub.smart_career_hub_backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        logger.info(">>> Incoming Request: {} {}?{}", req.getMethod(), req.getRequestURI(), req.getQueryString());
        
        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("!!! Request failed with exception: {}", e.getMessage(), e);
            throw e;
        } finally {
            logger.info("<<< Outgoing Response: status {}", res.getStatus());
        }
    }
}
