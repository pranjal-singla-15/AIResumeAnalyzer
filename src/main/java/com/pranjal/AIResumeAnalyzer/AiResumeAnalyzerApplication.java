package com.pranjal.AIResumeAnalyzer;

import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiResumeAnalyzerApplication {

    public static void main(String[] args) {
        // Force the recognized IANA timezone before database connections initialize
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

        SpringApplication.run(AiResumeAnalyzerApplication.class, args);
    }

}