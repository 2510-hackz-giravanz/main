output "secret_arn" {
  description = "ARN of the Google API Key secret"
  value       = aws_secretsmanager_secret.google_api_key.arn
}

output "secret_name" {
  description = "Name of the Google API Key secret"
  value       = aws_secretsmanager_secret.google_api_key.name
}

output "secret_id" {
  description = "ID of the Google API Key secret"
  value       = aws_secretsmanager_secret.google_api_key.id
}
