terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.7.1"
    }
  }
}

provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}

resource "cloudflare_record" "example" {
  domain  = var.domain
  name    = var.record_name
  value   = var.record_value
  type    = var.record_type
  ttl     = var.record_ttl
  proxied = var.record_proxied
}

resource "cloudflare_worker_script" "example" {
  name = "maintenance-worker"
  content = file("${path.module}/maintenance-interceptor.js")
}

resource "cloudflare_worker_route" "example" {
  pattern = "example.com/*"
  script_name = cloudflare_worker_script.example.name
}