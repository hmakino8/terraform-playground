provider "aws" {
  region = "ap-northeast-1"
}

# VPCの作成
# 65,536個のIPアドレスを持つ
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true # SSMに必要
  enable_dns_hostnames = true # SSMに必要

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# パブリックサブネットの作成
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name_prefix}-public-subnet"
  }
}

# インターネットゲートウェイ
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${local.name_prefix}-igw"
  }
}


# ルートテーブル
resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${local.name_prefix}-public-rtb"
  }
}

# ルートテーブルの関連付け
resource "aws_route_table_association" "public_rtb_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rtb.id
}

# SSM用のVPCエンドポイント
resource "aws_vpc_endpoint" "ssm" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ssm"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet.id]

  security_group_ids = [aws_security_group.endpoint_sg.id]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ssmmessages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet.id]

  security_group_ids = [aws_security_group.endpoint_sg.id]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ec2messages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet.id]

  security_group_ids = [aws_security_group.endpoint_sg.id]

  private_dns_enabled = true
}

# エンドポイント用セキュリティグループ
resource "aws_security_group" "endpoint_sg" {
  name        = "${local.name_prefix}-endpoint-sg"
  description = "security group for endpoint"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }
}

# EC2用セキュリティグループ
resource "aws_security_group" "ec2_sg" {
  name        = "${local.name_prefix}-ec2-sg"
  description = "security group for ec2"
  vpc_id      = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2用のIAMロール
resource "aws_iam_role" "ec2_role" {
  name = "${local.name_prefix}-ec2-role"

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
}

# SSM用のIAMポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# EC2用のインスタンスプロファイル
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${local.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# EC2インスタンス
resource "aws_instance" "ec2" {
  ami                    = "ami-094dc5cf74289dfbc"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public_subnet.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  tags = {
    Name = "${local.name_prefix}-ec2"
  }
}

# S3バケットの作成
resource "aws_s3_bucket" "bucket" {
  bucket = "${local.name_prefix}-transfer-bucket"
}

# S3バケットのバージョニング設定
resource "aws_s3_bucket_versioning" "bucket" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# EC2のIAMロールにS3アクセス権限を追加
resource "aws_iam_role_policy_attachment" "s3_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess" # 本番環境では必要最小限の権限に制限することを推奨
}
