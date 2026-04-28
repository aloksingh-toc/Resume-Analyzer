package com.resumeanalyzer.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

/**
 * JPA converter that serialises List<String> as a JSON array TEXT column.
 * Used for keywords, ATS issues, and missing sections stored in ResumeAnalysis.
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return MAPPER.writeValueAsString(list);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<String> convertToEntityAttribute(String data) {
        if (data == null || data.isBlank()) return List.of();
        try {
            return MAPPER.readValue(data, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
