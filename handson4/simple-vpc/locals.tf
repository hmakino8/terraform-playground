locals {
  app_name    = "simple-vpc"
  name_prefix = "${var.env}-${local.app_name}"
}
