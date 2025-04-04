resource "aws_vpc" "reservation-vpc" {
  cidr_block = "10.0.0.0/21"

  tags = {
    Name = "reservation-vpc"
  }
}

resource "aws_subnet" "web-subnet-01" {
  vpc_id     = aws_vpc.reservation-vpc.id
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "web-subnet-01"
  }
}

resource "aws_subnet" "api-subnet-01" {
  vpc_id     = aws_vpc.reservation-vpc.id
  cidr_block = "10.0.3.0/24"

  tags = {
    Name = "api-subnet-01"
  }
}

resource "aws_route_table" "web-routetable" {
  vpc_id = aws_vpc.reservation-vpc.id

  tags = {
    Name = "web-routetable"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.reservation-ig.id
  }
}

resource "aws_route_table" "api-routetable" {
  vpc_id = aws_vpc.reservation-vpc.id

  tags = {
    Name = "api-routetable"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.reservation-ig.id
  }
}

resource "aws_route_table_association" "web-subnet-01-association" {
  subnet_id      = aws_subnet.web-subnet-01.id
  route_table_id = aws_route_table.web-routetable.id

}

resource "aws_route_table_association" "api-subnet-01-association" {
  subnet_id      = aws_subnet.api-subnet-01.id
  route_table_id = aws_route_table.api-routetable.id

}

resource "aws_internet_gateway" "reservation-ig" {
  vpc_id = aws_vpc.reservation-vpc.id

  tags = {
    Name = "reservation-ig"
  }
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web-server" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.web-subnet-01.id
  # vpc_security_group_ids = [aws_security_group.web-security-group.id]

  tags = {
    Name = "web-server"
  }
}

