use std::fs::{self, create_dir_all};
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get user's home directory
    let home = std::env::var("HOME")?;
    
    // Define app directories
    let app_dir = PathBuf::from(&home)
        .join(".mcp-guardian");
    
    let pending_dir = app_dir.join("message-approvals/pending");
    
    // Create directory structure if it doesn't exist
    println!("Creating directory: {:?}", pending_dir);
    create_dir_all(&pending_dir)?;
    
    // Create sample messages
    let samples = [
        // Outbound tool call for fetching weather
        (
            "outbound_example_toolcall_1",
            r#"{
  "method": "tools/call",
  "params": {
    "name": "fetch_weather_data",
    "arguments": {
      "location": "San Francisco",
      "units": "metric",
      "forecast_days": 3
    }
  }
}"#,
        ),
        
        // Outbound tool call for database query
        (
            "outbound_example_toolcall_2",
            r#"{
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "query": "SELECT * FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 7 DAY)",
      "database": "user_analytics",
      "limit": 100
    }
  }
}"#,
        ),
        
        // Inbound tool call response
        (
            "inbound_example_response_1",
            r#"{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"current\": {\n    \"temp\": 15.2,\n    \"humidity\": 72,\n    \"conditions\": \"Partly cloudy\"\n  },\n  \"forecast\": [\n    {\n      \"day\": \"Tomorrow\",\n      \"high\": 17.5,\n      \"low\": 12.1,\n      \"conditions\": \"Sunny\"\n    },\n    {\n      \"day\": \"Thursday\",\n      \"high\": 16.8,\n      \"low\": 11.9,\n      \"conditions\": \"Cloudy with chance of rain\"\n    },\n    {\n      \"day\": \"Friday\",\n      \"high\": 14.2,\n      \"low\": 10.5,\n      \"conditions\": \"Rain\"\n    }\n  ]\n}"
      }
    ]
  }
}"#,
        ),
    ];
    
    // Write sample messages to files
    for (filename, content) in samples.iter() {
        let file_path = pending_dir.join(filename);
        println!("Creating sample message: {:?}", file_path);
        fs::write(file_path, content)?;
    }
    
    println!("Sample messages created successfully!");
    Ok(())
}