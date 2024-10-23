terraform {
  backend "http" {
  }
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
}

provider "yandex" {
  zone = "ru-central1-a"
}

resource "yandex_function" "ma-telegram" {

  name               = "ma-telegram"
  description        = "telegram"
  runtime            = "nodejs16"
  entrypoint         = "index.handler"
  memory             = "128"
  execution_timeout  = "120"
  service_account_id = var.yc_service_account_id
  folder_id          = var.yc_folder_id
  environment = {
    "TELEGRAM_TOKEN"      = var.telegram_token
    "GATEWAY_HOST"        = var.gateway_host
    "GATEWAY_BASIC_TOKEN" = var.gateway_basic_token
  }

  user_hash = data.archive_file.ma-telegram.output_base64sha256
  content {
    zip_filename = data.archive_file.ma-telegram.output_path
  }
}

resource "yandex_function" "ma-telegram-sender" {

  name               = "ma-telegram-sender"
  description        = "sender to backend from queue"
  runtime            = "nodejs16"
  entrypoint         = "sender.handler"
  memory             = "128"
  execution_timeout  = "600"
  service_account_id = var.yc_service_account_id
  folder_id          = var.yc_folder_id
  environment = {
    "GATEWAY_HOST"        = var.gateway_host
    "GATEWAY_BASIC_TOKEN" = var.gateway_basic_token
  }

  user_hash = data.archive_file.ma-telegram-sender.output_base64sha256
  content {
    zip_filename = data.archive_file.ma-telegram-sender.output_path
  }
}

resource "yandex_function_trigger" "queue-telegram-sender" {
  name        = "queue-telegram-sender"
  description = "It sends rest request from quque to backend"
  message_queue {
    queue_id           = yandex_message_queue.TELEGRAM_OUTCOMING_MQ.arn
    service_account_id = var.yc_service_account_id
    batch_size         = "1"
    batch_cutoff       = "10"
  }
  function {
    id                 = yandex_function.ma-telegram-sender.id
    service_account_id = var.yc_service_account_id
  }
}

resource "yandex_function_scaling_policy" "my_scaling_policy" {
  function_id = yandex_function.ma-telegram.id
  policy {
    tag                  = "$latest"
    zone_instances_limit = 10
    zone_requests_limit  = 30
  }
}

data "archive_file" "ma-telegram" {
  output_path = "${path.module}/.local/may-assistant.zip"
  source_dir  = "${path.module}/dist"
  type        = "zip"
}

data "archive_file" "ma-telegram-sender" {
  output_path = "${path.module}/.local/may-assistant-sender.zip"
  source_dir  = "${path.module}/dist/sender"
  type        = "zip"
}

resource "yandex_message_queue" "TELEGRAM_OUTCOMING_MQ" {
  name = "TELEGRAM_OUTCOMING_MQ"
  redrive_policy = jsonencode({
    deadLetterTargetArn = yandex_message_queue.telegram_outcoming_deadletter_mq.arn
    maxReceiveCount     = 3
  })
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}

resource "yandex_message_queue" "telegram_outcoming_deadletter_mq" {
  name       = "telegram_outcoming_deadletter_mq"
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}

resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = var.yc_service_account_id
  description        = "static access key for ymq & storage"
}

variable "yc_service_account_id" {
  description = "yandex cloud service_account_id"
  type        = string
}

variable "yc_folder_id" {
  description = "yandex cloud folder_id"
  type        = string
}

variable "telegram_token" {
  description = "Telegram Bot token"
}

variable "gateway_host" {
  type = string
}

variable "gateway_basic_token" {
  type = string
}

output "yandex_function_ma-telegram" {
  value = yandex_function.ma-telegram.id
}
