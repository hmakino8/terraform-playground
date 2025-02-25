# プロバイダーブロック
provider "aws" {
  region = "ap-northeast-1"
}

# VPCリソース
resource "aws_vpc" "terra_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "aws_vpc_handson"
  }
}

# サブネットリソース
resource "aws_subnet" "terra_subnet" {
  vpc_id = aws_vpc.terra_vpc.id

  cidr_block = "10.0.0.0/24"
}
