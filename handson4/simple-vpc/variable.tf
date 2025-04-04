variable "env" {
  type    = string
  default = "handson2"
}

variable "db_username" {
  type    = string
  default = "admin"
}

variable "db_password" {
  type      = string
  default   = "test1234"
  sensitive = true # パスワードをログに表示しない
}
