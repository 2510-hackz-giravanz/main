resource "aws_secretsmanager_secret" "google_api_key" {
  name        = "${var.project_name}/${var.environment}/google-api-key"
  description = "Google Gemini API Key for ${var.project_name} ${var.environment} environment"

  recovery_window_in_days = 7

  tags = {
    Name        = "${var.project_name}-${var.environment}-google-api-key"
    Environment = var.environment
  }
}

# Note: Secret value must be set manually after creation
# This is intentional for security - we don't want API keys in Terraform state
resource "aws_secretsmanager_secret_version" "google_api_key_placeholder" {
  secret_id = aws_secretsmanager_secret.google_api_key.id
  secret_string = jsonencode({
    GOOGLE_API_KEY = "PLACEHOLDER_REPLACE_ME"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
