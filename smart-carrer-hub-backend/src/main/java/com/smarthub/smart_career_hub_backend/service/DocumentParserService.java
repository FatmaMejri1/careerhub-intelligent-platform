package com.smarthub.smart_career_hub_backend.service;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DocumentParserService {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename != null && filename.toLowerCase().endsWith(".pdf")) {
            return extractTextFromPdf(file);
        } else if (filename != null && (filename.toLowerCase().endsWith(".docx") || filename.toLowerCase().endsWith(".doc"))) {
            return extractTextFromDocx(file);
        } else {
            // Placeholder for other formats or simple text extraction
            return new String(file.getBytes());
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        } catch (Exception e) {
            System.err.println("Error extracting text from DOCX: " + e.getMessage());
            // Fallback to basic string if POI fails (rare)
            return "";
        }
    }
}
