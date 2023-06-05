variable "cloudflare_email" {
  description = "Email for Cloudflare account"
  type        = string
}

variable "cloudflare_api_key" {
  description = "API key for Cloudflare account"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "The domain to manage"
  type        = string
}

variable "record_name" {
  description = "The name of the record"
  type        = string
}

variable "record_value" {
  description = "The value of the record"
  type        = string
}

variable "record_type" {
  description = "The type of the record"
  type        = string
}

variable "record_ttl" {
  description = "The TTL of the record"
  type        = number
  default     = 1
}

variable "record_proxied" {
  description = "Whether the record is proxied"
  type        = bool
  default     = false
}
