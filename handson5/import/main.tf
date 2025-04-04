# provider "aws" {
#   region = "ap-northeast-1"
# }
# 
# # import {
# #   id = "vpc-0d5a548477ef484cd"
# #   to = aws_vpc.imported_vpc
# # }
# 
# resource "aws_vpc" "imported_vpc" {
#   cidr_block = "10.0.0.0/24"
# 
#   tags = {
#     Name = "handson-vpc"
#   }
#   tags_all = {
#     Name = "handson-vpc"
#   }
# }
