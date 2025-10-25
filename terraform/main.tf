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
