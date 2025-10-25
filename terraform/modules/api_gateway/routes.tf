# Catch-all route for Lambda proxy integration
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Health check route
resource "aws_apigatewayv2_route" "health_check" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Questions generation route
resource "aws_apigatewayv2_route" "questions_generate" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /api/questions/generate"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Diagnosis route
resource "aws_apigatewayv2_route" "diagnosis" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /api/diagnosis"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}
