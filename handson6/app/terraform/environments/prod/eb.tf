resource "aws_elastic_beanstalk_application" "deicafe" {
  name        = var.project_name
  description = "Elastic Beanstalk Application for ${var.project_name}"
  tags        = local.tags
}

resource "aws_iam_role" "eb_service" {
  name = "${local.name_prefix}-eb-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "elasticbeanstalk.amazonaws.com"
        }
      }
    ]
  })
  tags = local.tags
}

resource "aws_iam_role" "eb_ec2" {
  name = "${local.name_prefix}-eb-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
  tags = local.tags
}

resource "aws_iam_instance_profile" "eb_ec2" {
  name = "${local.name_prefix}-eb-ec2-profile"
  role = aws_iam_role.eb_ec2.name
}

resource "aws_iam_role_policy_attachment" "eb_web_tier" {
  role       = aws_iam_role.eb_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "eb_s3_access" {
  role       = aws_iam_role.eb_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "eb_service" {
  role       = aws_iam_role.eb_service.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService"
}

resource "aws_elastic_beanstalk_environment" "mycafe_prod" {
  name                = "${local.name_prefix}-env"
  application         = aws_elastic_beanstalk_application.deicafe.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.5.0 running Python 3.11"
  tier                = "WebServer"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = module.vpc.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", module.vpc.private_subnets)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", module.vpc.public_subnets)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "false"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_ec2.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_ec2.id
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DJANGO_SETTINGS_MODULE"
    value     = "myproject.settings"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DJANGO_SECRET_KEY"
    value     = var.django_secret_key
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DJANGO_DEBUG"
    value     = "False"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "RDS_DB_NAME"
    value     = aws_db_instance.postgres.db_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "RDS_USERNAME"
    value     = aws_db_instance.postgres.username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "RDS_PASSWORD"
    value     = aws_db_instance.postgres.password
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "RDS_HOSTNAME"
    value     = aws_db_instance.postgres.address
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "RDS_PORT"
    value     = aws_db_instance.postgres.port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_STORAGE_BUCKET_NAME"
    value     = aws_s3_bucket.static_files.bucket
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_S3_REGION_NAME"
    value     = var.aws_region
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:proxy"
    name      = "ProxyServer"
    value     = "nginx"
  }

  tags = local.tags
}
