locals {
  app_name    = "my-vpc-ssm"
  name_prefix = "${var.env}-${local.app_name}"
}
