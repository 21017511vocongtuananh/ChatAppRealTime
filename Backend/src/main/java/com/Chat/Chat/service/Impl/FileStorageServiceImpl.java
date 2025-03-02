package com.Chat.Chat.service.Impl;

import com.Chat.Chat.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private final String UPLOAD_DIR = "uploads/";
    private static final Logger log = LoggerFactory.getLogger(FileStorageServiceImpl.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.error("❌ Invalid or empty file");
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            log.error("❌ File size exceeds 10MB: {} bytes", file.getSize());
            throw new IllegalArgumentException("Max file size is 10MB");
        }

        try {
            Path uploadPath = prepareUploadDirectory();
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);

            saveFile(file, filePath);
            return constructFileUrl(fileName);

        } catch (IOException e) {
            log.error("❌ File processing error: {}", e.getMessage(), e);
            throw new RuntimeException("File processing failed: " + e.getMessage(), e);
        }
    }

    private Path prepareUploadDirectory() throws IOException {
        Path path = Paths.get(UPLOAD_DIR);
        if (!Files.exists(path)) {
            log.info("🛠 Creating upload directory: {}", path);
            Files.createDirectories(path);
        }
        return path;
    }

    private String generateUniqueFileName(String originalName) {
        String extension = originalName != null ?
                originalName.substring(originalName.lastIndexOf(".")) : "";
        return UUID.randomUUID() + extension;
    }

    private void saveFile(MultipartFile file, Path path) throws IOException {
        Files.copy(
                file.getInputStream(),
                path,
                StandardCopyOption.REPLACE_EXISTING
        );
        log.info("💾 File stored at: {}", path);
    }

    private String constructFileUrl(String fileName) {
        return "/uploads/" + fileName;
    }
}