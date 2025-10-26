variable "project_name" {
  description = "プロジェクト名"
  type        = string
}

variable "environment" {
  description = "環境名（dev, prod など）"
  type        = string
}

variable "s3_bucket_id" {
  description = "S3 バケットの ID"
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "S3 バケットのリージョナルドメイン名"
  type        = string
}
