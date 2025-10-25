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
  
  environment = var.environment
  project_name = var.project_name
}

# Lambda モジュール
module "lambda" {
  source = "./modules/lambda"
  
  project_name  = var.project_name
  environment   = var.environment
  secret_arn    = module.secrets.secret_arn
  secret_name   = module.secrets.secret_name
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
