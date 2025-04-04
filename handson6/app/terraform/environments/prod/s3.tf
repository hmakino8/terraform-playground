resource "aws_s3_bucket" "static_files" {
  bucket = "${local.name_prefix}-static-files"
  tags   = local.tags
}

resource "aws_s3_bucket_ownership_controls" "static_files" {
  bucket = aws_s3_bucket.static_files.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "static_files" {
  bucket = aws_s3_bucket.static_files.id

  block_public_acls       = false // パブリックACLを許可
  block_public_policy     = false // パブリックポリシーを許可
  ignore_public_acls      = false // パブリックACLを無視
  restrict_public_buckets = false // パブリックバケットを許可
}

resource "aws_s3_bucket_policy" "static_files" {
  bucket = aws_s3_bucket.static_files.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_files.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.static_files]
}
