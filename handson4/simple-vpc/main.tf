provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true # SSMに必要
  enable_dns_hostnames = true # SSMに必要

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

resource "aws_subnet" "public_subnet_1a" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name_prefix}-public-subnet-1a"
  }
}

resource "aws_subnet" "private_subnet_1a" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name_prefix}-private-subnet-1a"
  }
}

resource "aws_subnet" "private_subnet_1c" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name_prefix}-private-subnet-1c"
  }
}

# NAT ゲートウェイ用のElastic IP
resource "aws_eip" "nat_gtw_eip" {
  domain = "vpc"
  tags = {
    Name = "${local.name_prefix}-nat-gtw-eip"
  }
}

# NAT ゲートウェイ
resource "aws_nat_gateway" "nat_gtw" {
  allocation_id = aws_eip.nat_gtw_eip.id
  subnet_id     = aws_subnet.public_subnet_1a.id

  tags = {
    Name = "${local.name_prefix}-nat-gtw"
  }
}

# プライベートサブネット用のルートテーブル
resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gtw.id
  }

  tags = {
    Name = "${local.name_prefix}-private-rtb"
  }
}

# プライベートルートテーブルの紐付け(1a)
resource "aws_route_table_association" "private_rtb_assoc_1a" {
  subnet_id      = aws_subnet.private_subnet_1a.id
  route_table_id = aws_route_table.private_rtb.id
}

# プライベートルートテーブルの紐付け(1c)
resource "aws_route_table_association" "private_rtb_assoc_1c" {
  subnet_id      = aws_subnet.private_subnet_1c.id
  route_table_id = aws_route_table.private_rtb.id
}

# インターネットゲートウェイ
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# パブリックルートテーブル用のルートテーブル
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

# パブリックルートテーブルの関連付け
resource "aws_route_table_association" "public_rtb_assoc_1a" {
  subnet_id      = aws_subnet.public_subnet_1a.id
  route_table_id = aws_route_table.public_rtb.id
}

# SSM用のVPCエンドポイント
resource "aws_vpc_endpoint" "ssm" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ssm"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet_1a.id]

  security_group_ids = [aws_security_group.endpoint_sg.id]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ssmmessages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet_1a.id]

  security_group_ids = [aws_security_group.endpoint_sg.id]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.ap-northeast-1.ec2messages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.public_subnet_1a.id]

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
resource "aws_security_group" "private_ec2_sg" {
  name        = "${local.name_prefix}-private-ec2-sg"
  description = "security group for private ec2"
  vpc_id      = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2用のIAMロール
resource "aws_iam_role" "private_ec2_role" {
  name = "${local.name_prefix}-private-ec2-role"

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
  role       = aws_iam_role.private_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# EC2用のインスタンスプロファイル
resource "aws_iam_instance_profile" "private_ec2_profile" {
  name = "${local.name_prefix}-private-ec2-profile"
  role = aws_iam_role.private_ec2_role.name
}

# プライベートサブネットのEC2インスタンス
resource "aws_instance" "private_ec2" {
  ami                    = "ami-094dc5cf74289dfbc"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_subnet_1a.id
  iam_instance_profile   = aws_iam_instance_profile.private_ec2_profile.name
  vpc_security_group_ids = [aws_security_group.private_ec2_sg.id]

  tags = {
    Name = "${local.name_prefix}-private-ec2-1a"
  }
}

# RDS用のサブネットグループ
resource "aws_db_subnet_group" "rds" {
  name       = "${local.name_prefix}-rds-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1c.id]
}

# RDS用セキュリティグループ
resource "aws_security_group" "rds_sg" {
  name        = "${local.name_prefix}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port       = 3306 # MySQLのデフォルトポート
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.private_ec2_sg.id]
  }
}

# RDS用のIAMポリシーを作成
resource "aws_iam_role_policy" "rds_policy" {
  name = "${local.name_prefix}-rds-policy"
  role = aws_iam_role.private_ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances"
        ]
        Resource = "*"
      }
    ]
  })
}

# RDSインスタンス
resource "aws_db_instance" "mysql" {
  identifier          = "${local.name_prefix}-db"
  engine              = "mysql"
  engine_version      = "8.0"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  username            = var.db_username
  password            = var.db_password
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.rds.name
}
