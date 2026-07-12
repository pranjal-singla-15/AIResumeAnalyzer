package com.pranjal.AIResumeAnalyzer.service;

import com.pranjal.AIResumeAnalyzer.dto.JobSearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class JobSearchService {

    @Autowired
    public RestTemplate restTemplate;

    @Value("${rapidapi.key}")
    private String apiKey;

    @Value("${rapidapi.host}")
    private String apiHost;

    public JobSearchResponse searchJobs(String query) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", apiHost);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url =
                "https://jsearch.p.rapidapi.com/search-v2?" +
                        "query=" + URLEncoder.encode(query, StandardCharsets.UTF_8) +
                        "&num_pages=1";

        ResponseEntity<JobSearchResponse> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        JobSearchResponse.class
                );

        return response.getBody();

    }
}
