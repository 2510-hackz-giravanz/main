output "secret_arn" {
  description = "ARN of the Google API Key secret"
  value       = module.secrets.secret_arn
}

output "secret_name" {
  description = "Name of the Google API Key secret"
  value       = module.secrets.secret_name
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.lambda.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = module.lambda.function_arn
}

output "lambda_log_group" {
  description = "CloudWatch Logs group name"
  value       = module.lambda.log_group_name
}

output "api_endpoint" {
  description = "API Gateway HTTP API endpoint URL"
  value       = module.api_gateway.api_endpoint
}

output "api_invoke_url" {
  description = "API Gateway invoke URL (with stage)"
  value       = module.api_gateway.stage_invoke_url
}
