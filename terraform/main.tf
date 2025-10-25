terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Giravanz Match"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Secrets Manager モジュール
module "secrets" {
  source = "./modules/secrets"

  environment  = var.environment
  project_name = var.project_name
}

# Lambda モジュール
module "lambda" {
  source = "./modules/lambda"

  project_name   = var.project_name
  environment    = var.environment
  secret_arn     = module.secrets.secret_arn
  secret_name    = module.secrets.secret_name
  lambda_timeout = 60
  lambda_memory  = 512
}

# API Gateway モジュール
module "api_gateway" {
  source = "./modules/api_gateway"

  project_name         = var.project_name
  environment          = var.environment
  lambda_invoke_arn    = module.lambda.invoke_arn
  lambda_function_name = module.lambda.function_name
}

# S3 モジュール
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

# CloudFront モジュール
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name                   = var.project_name
  environment                    = var.environment
  s3_bucket_id                   = module.s3.bucket_id
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

# S3バケットポリシー（CloudFront作成後に適用）
resource "aws_s3_bucket_policy" "frontend" {
  bucket = module.s3.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [
    module.s3,
    module.cloudfront
  ]
}



