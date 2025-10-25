output "bucket_id" {
  description = "S3 バケットの ID"
  value       = aws_s3_bucket.frontend.id
}

output "bucket_arn" {
  description = "S3 バケットの ARN"
  value       = aws_s3_bucket.frontend.arn
}

output "bucket_regional_domain_name" {
  description = "S3 バケットのリージョナルドメイン名"
  value       = aws_s3_bucket.frontend.bucket_regional_domain_name
}

output "website_endpoint" {
  description = "S3 ウェブサイトエンドポイント"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
