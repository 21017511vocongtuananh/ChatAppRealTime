package com.Chat.Chat.service.Impl;

import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class S3Service {
	private final String bucketName = "image-zaloclone";

	@Value("${aws.s3.access-key-id}")
	private String awsS3AccessKey;

	@Value("${aws.s3.secret-access-key}")
	private String awsS3SecretKey;



	public String saveImageToS3(MultipartFile photo){
		try {
			String s3FileName = photo.getOriginalFilename();
			BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecretKey);
			AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
					.withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
					.withRegion(Regions.US_EAST_2)
					.build();
			InputStream inputStream = photo.getInputStream();
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType("image/jpeg");
			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream, metadata);
			s3Client.putObject(putObjectRequest);

			return "https://" + bucketName + ".s3.us-east-2.amazonaws.com/" + s3FileName;
		}catch (IOException e){
			e.printStackTrace();
			throw new ErrorException(ErrorCode.INTERNAL_SERVER_ERROR,"Unable to upload image to s3 bucket: " + e.getMessage());
		}
	}
}
