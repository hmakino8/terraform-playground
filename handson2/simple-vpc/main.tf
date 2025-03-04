provider "aws" {
  region = "ap-northeast-1"
}

# VPCの作成
# 65,536個のIPアドレスを持つ
resource "aws_vpc" "simple_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# インターネットゲートウェイ
resource "aws_internet_gateway" "simple_igw" {
  vpc_id = aws_vpc.simple_vpc.id
  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# パブリックサブネットの作成
# 256個のIPアドレスを持つ
resource "aws_subnet" "simple_public_subnet" {
  vpc_id                  = aws_vpc.simple_vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "${local.name_prefix}-public-subnet"
  }
}

# プライベートサブネットの作成
# 256個のIPアドレスを持つ
resource "aws_subnet" "simple_private_subnet" {
  vpc_id            = aws_vpc.simple_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "${local.name_prefix}-private-subnet"
  }
}

# NATゲートウェイ用のElastic IP(固定IPアドレスの作成
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags = {
    Name = "${local.name_prefix}-nat-eip"
  }
}

# NATゲートウェイ
# プライベートサブネットからインターネットへの接続に必要
# パブリックサブネットに配置する
resource "aws_nat_gateway" "simple_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.simple_public_subnet.id
}

# パブリックサブネット用の
# インターネットゲートウェイへのルートを含む
resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.simple_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.simple_igw.id
  }

  tags = {
    Name = "${local.name_prefix}-public-rtb"
  }
}

# プライベートサブネット用のルートテーブル
# インターネットゲートウェイへのルート含む
resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.simple_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.simple_nat.id
  }

  tags = {
    Name = "${local.name_prefix}-private-rtb"
  }
}

# パブリックサブネットとルートテーブルの紐付け
resource "aws_route_table_association" "public_rtb_assoc" {
  subnet_id      = aws_subnet.simple_public_subnet.id
  route_table_id = aws_route_table.public_rtb.id
}

# プライベートサブネットとルートテーブルの紐付け
resource "aws_route_table_association" "private_rtb_assoc" {
  subnet_id      = aws_subnet.simple_private_subnet.id
  route_table_id = aws_route_table.private_rtb.id
}

# セキュリティグループの作成
# SSH接続とアウトバウンドの通信を許可
resource "aws_security_group" "simple_sg" {
  name        = "${local.name_prefix}-sg"
  description = "Allow SSH inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.simple_vpc.id

  # インバウンドのトラフィックルール
  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    # cidr_blocks = [var.ssh_ip]  // DWSのプロキシ経由に設定したいが、そのままだとブロックされる
    cidr_blocks = ["0.0.0.0/0"] // ブロックされるので、とりあえず0.0.0.0/0に設定
  }

  # アウトバウンドのトラフィックルール
  egress {
    from_port   = 0    // ポート範囲を0-0(すべてのポート)に設定
    to_port     = 0    // ポート範囲を0-0(すべてのポート)に設定
    protocol    = "-1" // -1はすべてのプロトコル(TCP, UDP, ICMPなど)を表す特殊な値
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# SSH接続用のキーペア
resource "aws_key_pair" "simple_key" {
  key_name   = "${local.name_prefix}-key"
  public_key = file("~/.ssh/${local.name_prefix}.pub")
}

# パブリックサブネットのEC2インスタンス
resource "aws_instance" "public_ec2" {
  ami                         = "ami-094dc5cf74289dfbc"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.simple_public_subnet.id
  vpc_security_group_ids      = [aws_security_group.simple_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.simple_key.key_name

  tags = {
    Name = "${local.name_prefix}-public-ec2"
  }
}

# プライベートサブネットのEC2インスタンス
resource "aws_instance" "private_ec2" {
  ami                    = "ami-094dc5cf74289dfbc"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.simple_private_subnet.id
  vpc_security_group_ids = [aws_security_group.simple_sg.id]
  key_name               = aws_key_pair.simple_key.key_name

  tags = {
    Name = "${local.name_prefix}-private-ec2"
  }
}
