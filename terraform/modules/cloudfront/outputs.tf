output "distribution_id" {
  description = "CloudFront ディストリビューションの ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "distribution_arn" {
  description = "CloudFront ディストリビューションの ARN"
  value       = aws_cloudfront_distribution.frontend.arn
}

output "domain_name" {
  description = "CloudFront ディストリビューションのドメイン名"
  value       = aws_cloudfront_distribution.frontend.domain_name
}
