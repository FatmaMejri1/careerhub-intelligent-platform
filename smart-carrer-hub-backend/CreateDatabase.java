import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDatabase {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres"; // connect to default DB
        String user = "postgres";
        String password = "postgres"; // based on properties

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
             
            // Check if DB exists
            var rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = 'carrerhub'");
            if (!rs.next()) {
                stmt.executeUpdate("CREATE DATABASE carrerhub");
                System.out.println("Database 'carrerhub' created successfully.");
            } else {
                System.out.println("Database 'carrerhub' already exists.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
