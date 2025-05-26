#!/usr/bin/env bash

set -euo pipefail

APP_NAME="text-transformer"
APP_DIR_MACOS="$HOME/Library/Application Support/$APP_NAME"
APP_DIR_LINUX="$HOME/.$APP_NAME"
REPO_URL="https://github.com/psihpisun/text-transformer.git"

SERVICE_NAME_MACOS="com.psihpisun.$APP_NAME"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_FILE="$PLIST_DIR/$SERVICE_NAME_MACOS.plist"

SERVICE_NAME_LINUX="$APP_NAME"
SERVICE_FILE_LINUX="$HOME/.config/systemd/user/${SERVICE_NAME_LINUX}.service"

APP_DIR=""
OS_TYPE="" # "macos" or "linux"
INIT_SYSTEM="" # "systemd", "launchd", or "none"

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
            if command -v systemctl &>/dev/null && systemctl --user PING &>/dev/null 2>&1; then
                INIT_SYSTEM="systemd"
                info "Определена ОС: Linux (systemd)"
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

detect_linux_distro(){
    if [[ -r /etc/os-release ]]; then
        . /etc/os-release
        echo "$ID"
    else
        echo "unknown"
    fi
}

install_node_macos(){
    if ! command -v brew &>/dev/null; then
        error "Homebrew не найден. Пожалуйста, установите Homebrew (https://brew.sh/) и попробуйте снова."
    fi
    info "Установка Node.js и npm через Homebrew..."
    brew install node || error "Не удалось установить Node.js через Homebrew."
}

install_node_linux(){
    local distro
    distro=$(detect_linux_distro)
    info "Node.js и npm не найдены. Пробуем установить для '$distro'..."

    case "$distro" in
        arch)
            sudo pacman -Sy --noconfirm nodejs npm
            ;;
        ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get update
            sudo apt-get install -y nodejs
            ;;
        fedora)
            sudo dnf module install -y nodejs:20
            ;;
        *)
            error "Дистрибутив Linux '$distro' не поддерживается для автоматической установки Node.js. Пожалуйста, установите Node.js (версия 20+) и npm вручную."
            ;;
    esac
}

install_node(){
    if [[ "$OS_TYPE" == "macos" ]]; then
        install_node_macos
    elif [[ "$OS_TYPE" == "linux" ]]; then
        install_node_linux
    fi
    success "Node.js и npm установлены."
}

setup_service(){
    if [[ "$INIT_SYSTEM" == "launchd" ]]; then
        setup_launchd_service
    elif [[ "$INIT_SYSTEM" == "systemd" ]]; then
        setup_systemd_service
    else
        info "Автоматическая настройка службы автозапуска не поддерживается для вашей системы."
        info "Для автозапуска приложения вам потребуется настроить его вручную."
        info "Вы можете добавить 'cd $APP_DIR && npm start' в ваш ~/.profile, ~/.xinitrc или аналогичный файл."
    fi
}

setup_launchd_service(){
    info "Настраиваем macOS LaunchAgent: $PLIST_FILE"
    mkdir -p "$PLIST_DIR"

    cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$SERVICE_NAME_MACOS</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(command -v npm)</string>
        <string>start</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$APP_DIR</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$APP_DIR/stdout.log</string>
    <key>StandardErrorPath</key>
    <string>$APP_DIR/stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PATH</key>
        <string>$(dirname "$(command -v npm)"):$PATH</string>
    </dict>
</dict>
</plist>
EOF

    info "Загружаем и стартуем LaunchAgent '$SERVICE_NAME_MACOS'..."
    launchctl unload -w "$PLIST_FILE" 2>/dev/null || true
    launchctl load -w "$PLIST_FILE"
    success "LaunchAgent настроен и запущен."
}

setup_systemd_service(){
    info "Настраиваем systemd-сервис: $SERVICE_FILE_LINUX"
    mkdir -p "$(dirname "$SERVICE_FILE_LINUX")"

    cat > "$SERVICE_FILE_LINUX" <<EOF
[Unit]
Description=Text Transformer React App
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=$(command -v npm) start
Restart=always
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

    info "Перезагружаем systemd user-демона…"
    systemctl --user daemon-reload

    info "Включаем и стартуем сервис '$SERVICE_NAME_LINUX'…"
    systemctl --user enable --now "$SERVICE_NAME_LINUX"
    success "Systemd сервис настроен и запущен."
}

# --- Main Script ---
detect_os_and_init

if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    install_node
else
    success "Node.js и npm уже установлены."
fi

info "Используем node: $(node -v), npm: $(npm -v)"
info "Папка приложения: $APP_DIR"
mkdir -p "$APP_DIR"

if [[ -d ".git" ]] && [[ -f "./package.json" ]]; then
    info "Локальный репозиторий/проект обнаружен — копируем файлы через rsync"
    rsync -a --exclude node_modules --exclude .git --exclude '*.log' --exclude "$APP_DIR_MACOS" --exclude "$APP_DIR_LINUX" ./ "$APP_DIR/"
else
    info "Клонируем репозиторий из GitHub: $REPO_URL"
    git clone --depth=1 "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

info "Установка npm-зависимостей…"
if [[ -f "package-lock.json" ]]; then
    info "Найден package-lock.json, используем npm ci..."
    npm ci || { error "npm ci завершился с ошибкой. Попробуйте удалить node_modules и package-lock.json (если проблема с ним) и запустить установку снова."; exit 1; }
else
    info "package-lock.json не найден, используем npm install..."
    npm install || { error "npm install завершился с ошибкой."; exit 1; }
fi

info "Сборка проекта (если есть build скрипт)..."
if npm run build --if-present; then
    success "Проект собран."
else
    info "Скрипт 'build' не найден в package.json или завершился с ошибкой (пропускаем)."
fi

setup_service

success "Установка завершена!"
if [[ "$INIT_SYSTEM" == "launchd" ]]; then
    success "Приложение будет запускаться автоматически при входе в систему."
    info "Логи можно найти в $APP_DIR/stdout.log и $APP_DIR/stderr.log"
elif [[ "$INIT_SYSTEM" == "systemd" ]]; then
    success "Приложение будет запускаться автоматически при старте вашей сессии."
    info "Для просмотра логов используйте: journalctl --user -u $SERVICE_NAME_LINUX -f"
fi