output "api_id" {
  description = "ID of the HTTP API"
  value       = aws_apigatewayv2_api.http_api.id
}

output "api_endpoint" {
  description = "HTTP API endpoint URL"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "api_execution_arn" {
  description = "Execution ARN of the HTTP API"
  value       = aws_apigatewayv2_api.http_api.execution_arn
}

output "stage_invoke_url" {
  description = "Invoke URL of the default stage"
  value       = aws_apigatewayv2_stage.default.invoke_url
}
