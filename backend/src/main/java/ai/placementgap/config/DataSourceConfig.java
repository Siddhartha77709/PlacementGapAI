package ai.placementgap.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${DB_URL:}")
    private String envDbUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = (envDbUrl != null && !envDbUrl.isBlank()) ? envDbUrl.trim() :
                (configuredUrl != null ? configuredUrl.trim() : "");

        String url = rawUrl;

        // If URL is empty, blank, or placeholder, safely default to in-memory H2
        if (url.isBlank() || url.equalsIgnoreCase("null") || url.equals("jdbc:") || url.equals("jdbc:mysql://")) {
            log.info("No valid DB_URL provided. Initializing in-memory H2 database (MySQL compatibility mode).");
            url = "jdbc:h2:mem:placementgap;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE";
            username = "sa";
            password = "";
        }

        // Auto-fix URL format if user pasted standard cloud connection string like mysql://...
        if (url.startsWith("mysql://")) {
            log.info("Detected 'mysql://' prefix in DB_URL; automatically prepending 'jdbc:' for JDBC driver compliance.");
            url = "jdbc:" + url;
        } else if (!url.startsWith("jdbc:")) {
            log.warn("DB URL does not start with 'jdbc:'; automatically prepending 'jdbc:'.");
            url = "jdbc:" + url;
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setUsername(username != null ? username : "");
        ds.setPassword(password != null ? password : "");

        if (url.startsWith("jdbc:h2:")) {
            ds.setDriverClassName("org.h2.Driver");
        } else if (url.startsWith("jdbc:mysql:")) {
            ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }

        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(1);
        ds.setConnectionTimeout(30000);

        log.info("DataSource configured successfully with prefix: {}", url.split("\\?")[0]);
        return ds;
    }
}
