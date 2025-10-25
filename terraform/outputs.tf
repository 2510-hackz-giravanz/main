output "secret_arn" {
  description = "ARN of the Google API Key secret"
  value       = module.secrets.secret_arn
}

output "secret_name" {
  description = "Name of the Google API Key secret"
  value       = module.secrets.secret_name
}
