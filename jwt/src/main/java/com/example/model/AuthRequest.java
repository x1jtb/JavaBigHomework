public class AuthRequest {
    private String username;
    private String password;

    // Getters and Setters
}

public class AuthResponse {
    private final String jwt;

    public AuthResponse(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }
}
