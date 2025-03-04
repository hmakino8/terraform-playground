variable "env" {
  type    = string
  default = "handson2"
}

variable "ssh_ip" {
  description = "SSH接続許可IP"
  type        = string
}

variable "ssh_key_path" {
  description = "sshパス"
  type        = string
}

