terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project_name}-${var.env}"
  tags = {
    Project     = var.project_name
    Environment = var.env
    ManagedBy   = "terraform"
  }
}
