package com.Chat.Chat.service.Impl;

import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3Service {
	private final String bucketName = "image-clonezalo";

	@Value("${aws.s3.access-key-id}")
	private String awsS3AccessKey;

	@Value("${aws.s3.secret-access-key}")
	private String awsS3SecretKey;

	public String saveImageToS3(MultipartFile photo) {
		try {
			String s3FileName = photo.getOriginalFilename();
			AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(awsS3AccessKey, awsS3SecretKey);
			StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(awsCredentials);
			S3Client s3Client = S3Client.builder()
					.credentialsProvider(credentialsProvider)
					.region(Region.US_EAST_1)
					.build();
			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
					.bucket(bucketName)
					.key(s3FileName)
					.contentType("image/jpeg")
					.build();
			s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(photo.getInputStream(), photo.getSize()));
			return "https://" + bucketName + ".s3.us-east-1.amazonaws.com/" + s3FileName;
		} catch (IOException e) {
			e.printStackTrace();
			throw new ErrorException(ErrorCode.INTERNAL_SERVER_ERROR, "Unable to upload image to S3 bucket: " + e.getMessage());
		}
	}
}