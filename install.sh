#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$HOME/.text-transformer"
SERVICE_NAME="text-transformer"
SERVICE_FILE="$HOME/.config/systemd/user/${SERVICE_NAME}.service"
REPO_URL="https://github.com/psihpisun/text-transformer.git"

info(){ printf "\e[1;34m➜ %s\e[0m\n" "$1"; }
success(){ printf "\e[1;32m✔ %s\e[0m\n" "$1"; }
error(){ printf "\e[1;31m✖ %s\e[0m\n" "$1" >&2; exit 1; }

detect_distro(){
    if [[ -r /etc/os-release ]]; then
        . /etc/os-release
        echo "$ID"
    else
        echo "unknown"
    fi
}

install_node(){
    local distro
    distro=$(detect_distro)
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
            error "Дистрибутив '$distro' не поддерживается — установку Node.js нужно делать вручную."
            ;;
    esac
    success "Node.js и npm установлены."
}

if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    install_node
fi

info "Используем node: $(node -v), npm: $(npm -v)"

info "Создаём папку: $APP_DIR"
mkdir -p "$APP_DIR"

if [[ -f "./package.json" ]]; then
    info "Локальный пакет обнаружен — копируем файлы через rsync"
    rsync -a --exclude node_modules --exclude .git ./ "$APP_DIR"
else
    info "Клонируем репозиторий из GitHub"
    git clone --depth=1 "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

info "Установка npm-зависимостей…"
npm install

info "Сборка проекта…"
npm run build

info "Настраиваем systemd-сервис: $SERVICE_FILE"
mkdir -p "$(dirname "$SERVICE_FILE")"

cat > "$SERVICE_FILE" <<EOF
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

info "Включаем и стартуем сервис '$SERVICE_NAME'…"
systemctl --user enable --now "$SERVICE_NAME"

success "Установка завершена! Приложение будет запускаться автоматически при старте вашей сессии."