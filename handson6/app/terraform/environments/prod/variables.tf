variable "aws_region" {
  description = "AWS region"
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Project name"
  default     = "mycafe"
}

variable "env" {
  description = "Environment"
  default     = "prod"
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "django_secret_key" {
  description = "Django secret key"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository URL"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  default     = "main"
}
