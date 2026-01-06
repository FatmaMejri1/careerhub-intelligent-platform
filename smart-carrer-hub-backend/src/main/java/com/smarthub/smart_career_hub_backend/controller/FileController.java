package com.smarthub.smart_career_hub_backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @GetMapping("/cv")
    public ResponseEntity<Resource> serveCV(@RequestParam String path) {
        try {
            // Basic security check to prevent directory traversal
            if (path.contains("..")) {
                return ResponseEntity.badRequest().build();
            }

            // Get the base directory (root of the project)
            String baseDir = System.getProperty("user.dir");

            // Handle if path already starts with / or \
            if (path.startsWith("/") || path.startsWith("\\")) {
                path = path.substring(1);
            }

            // Construct full path
            Path filePath = Paths.get(baseDir, path);
            File file = filePath.toFile();

            if (!file.exists()) {
                System.err.println("File search failed at: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentDisposition = "inline; filename=\"" + resource.getFilename() + "\"";

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                        .body(resource);
            } else {
                System.err.println("Resource not readable: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
