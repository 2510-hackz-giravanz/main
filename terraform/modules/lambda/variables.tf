variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "secret_arn" {
  description = "ARN of the Secrets Manager secret containing Google API Key"
  type        = string
}

variable "secret_name" {
  description = "Name of the Secrets Manager secret"
  type        = string
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 60
}

variable "lambda_memory" {
  description = "Lambda function memory in MB"
  type        = number
  default     = 512
}
