package com.example.server.DTO.Respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class VehicleTypeRatioResponse {
    private String name;
    private long value;

    public VehicleTypeRatioResponse() {}
    public VehicleTypeRatioResponse(String name, long value) {
        this.name = name;
        this.value = value;
    }

    // getters + setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public long getValue() { return value; }
    public void setValue(long value) { this.value = value; }
}

