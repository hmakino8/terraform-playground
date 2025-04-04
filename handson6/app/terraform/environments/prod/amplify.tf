resource "aws_amplify_app" "frontend" {
  name         = "${local.name_prefix}-frontend"
  repository   = var.github_repo
  access_token = var.github_token

  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - cd app/frontend
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: app/frontend/.next
            files:
              - '**/*'
          cache:
            paths:
              - app/frontend/node_modules/**/*
  EOT

  # バックエンドAPIのURLを環境変数として設定
  environment_variables = {
    NEXT_PUBLIC_API_URL = "https://${aws_elastic_beanstalk_environment.mycafe_prod.cname}/api"
  }

  tags = local.tags
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.github_branch

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"

  enable_auto_build = true
}

# 必要に応じてカスタムドメインを設定
# resource "aws_amplify_domain_association" {
#   app_id      = aws_amplify_app.frontend.id
#   domain_name = "deicafe.example.com"
#   
#   sub_domain {
#     branch_name = aws_amplify_branch.main.branch_name
#     prefix      = ""
#   }
# }
