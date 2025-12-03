package com.smarthub.smart_career_hub_backend.exception;
public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}