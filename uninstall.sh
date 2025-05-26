#!/bin/bash

set -e

SERVICE_NAME="text-transformer.service"
INSTALL_DIR="$HOME/.text-transformer"

echo "🧼 Удаление службы systemd ($SERVICE_NAME)..."
systemctl --user stop $SERVICE_NAME || true
systemctl --user disable $SERVICE_NAME || true
rm -f "$HOME/.config/systemd/user/$SERVICE_NAME"
systemctl --user daemon-reload

echo "🗑️ Удаление директории $INSTALL_DIR..."
rm -rf "$INSTALL_DIR"

echo "✅ Uninstall завершён."