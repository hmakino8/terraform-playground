variable "env" {
  type    = string
  default = "handson4"
}

variable "db_username" {
  type    = string
  default = "admin"
}

variable "db_password" {
  type      = string
  sensitive = true # パスワードをログに表示しない
}
