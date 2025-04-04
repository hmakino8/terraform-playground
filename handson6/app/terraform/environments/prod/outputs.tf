output "elastic_beanstalk_url" {
  description = "URL of the Elastic Beanstalk environment"
  value       = "https://${aws_elastic_beanstalk_environment.mycafe_prod.cname}"
}

output "amplify_default_domain" {
  description = "Default domain for the Amplify app"
  value       = aws_amplify_app.frontend.default_domain
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "static_bucket_name" {
  description = "S3 bucket for static files"
  value       = aws_s3_bucket.static_files.bucket
}
