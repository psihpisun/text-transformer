#!/usr/bin/env bash

set -euo pipefail

APP_NAME="text-transformer"
APP_DIR_MACOS="$HOME/Library/Application Support/$APP_NAME"
APP_DIR_LINUX="$HOME/.$APP_NAME"

SERVICE_NAME_MACOS="com.psihpisun.$APP_NAME"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_FILE="$PLIST_DIR/$SERVICE_NAME_MACOS.plist"

SERVICE_NAME_LINUX="${APP_NAME}.service"
SYSTEMD_SERVICE_FILE_LINUX="$HOME/.config/systemd/user/$SERVICE_NAME_LINUX"

APP_DIR=""
OS_TYPE=""
INIT_SYSTEM=""

info(){ printf "\\e[1;34m➜ %s\\e[0m\\n" "$1"; }
success(){ printf "\\e[1;32m✔ %s\\e[0m\\n" "$1"; }
error(){ printf "\\e[1;31m✖ %s\\e[0m\\n" "$1" >&2; exit 1; }

detect_os_and_init(){
    case "$(uname -s)" in
        Darwin)
            OS_TYPE="macos"
            APP_DIR="$APP_DIR_MACOS"
            INIT_SYSTEM="launchd"
            info "Определена ОС: macOS"
            ;;
        Linux)
            OS_TYPE="linux"
            APP_DIR="$APP_DIR_LINUX"
            if command -v systemctl &>/dev/null && systemctl --user list-units --full -all | grep -Fq "$SERVICE_NAME_LINUX"; then
                INIT_SYSTEM="systemd"
                info "Определена ОС: Linux (systemd)"
            elif [[ -f "$SYSTEMD_SERVICE_FILE_LINUX" ]]; then
                 INIT_SYSTEM="systemd"
                 info "Определена ОС: Linux (systemd - сервис файл найден)"
            else
                INIT_SYSTEM="none"
                info "Определена ОС: Linux (без systemd)"
            fi
            ;;
        *)
            error "Неподдерживаемая ОС: $(uname -s)"
            ;;
    esac
}

uninstall_service(){
    if [[ "$INIT_SYSTEM" == "launchd" ]]; then
        uninstall_launchd_service
    elif [[ "$INIT_SYSTEM" == "systemd" ]]; then
        uninstall_systemd_service
    else
        info "Автоматическое удаление службы не требуется или не поддерживается."
    fi
}

uninstall_launchd_service(){
    info "🧼 Удаление macOS LaunchAgent ($SERVICE_NAME_MACOS)..."
    if [[ -f "$PLIST_FILE" ]]; then
        launchctl unload -w "$PLIST_FILE" 2>/dev/null || true
        rm -f "$PLIST_FILE"
        success "LaunchAgent $SERVICE_NAME_MACOS удален."
    else
        info "LaunchAgent $SERVICE_NAME_MACOS не найден."
    fi
}

uninstall_systemd_service(){
    info "🧼 Удаление службы systemd ($SERVICE_NAME_LINUX)..."
    systemctl --user stop "$SERVICE_NAME_LINUX" 2>/dev/null || true
    systemctl --user disable "$SERVICE_NAME_LINUX" 2>/dev/null || true
    if [[ -f "$SYSTEMD_SERVICE_FILE_LINUX" ]]; then
        rm -f "$SYSTEMD_SERVICE_FILE_LINUX"
        info "Файл службы $SYSTEMD_SERVICE_FILE_LINUX удален."
    else
        info "Файл службы $SYSTEMD_SERVICE_FILE_LINUX не найден."
    fi
    systemctl --user daemon-reload
    systemctl --user reset-failed 2>/dev/null || true
    success "Служба systemd $SERVICE_NAME_LINUX удалена."
}

detect_os_and_init

uninstall_service

info "🗑️ Удаление директории приложения $APP_DIR..."
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
    success "Директория $APP_DIR удалена."
else
    info "Директория $APP_DIR не найдена."
fi

success "✅ Удаление завершено."