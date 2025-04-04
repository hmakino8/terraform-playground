resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets
  tags       = local.tags
}

resource "aws_db_instance" "postgres" {
  identifier        = "${local.name_prefix}-db"
  engine            = "postgres"
  engine_version    = "15.12"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  # db_name                = "${local.name_prefix}-db"
  db_name                = "postgres"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  skip_final_snapshot     = true

  parameter_group_name = "default.postgres15"

  tags = local.tags
}
