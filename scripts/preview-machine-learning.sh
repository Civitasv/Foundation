#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用法：./scripts/preview-machine-learning.sh [--build-only]

默认：检查数学公式、重新构建课件，然后启动本地预览服务。
--build-only：只检查和构建；已有预览服务时，刷新浏览器即可。
首次运行会创建课程 .venv 并安装 Python 依赖，需要联网。
可用 EDTRACE_PYTHON 指定已有 Python 环境，用 PREVIEW_PORT 指定端口（默认 5180）。
EOF
}

build_only=false
case "${1:-}" in
  "") ;;
  --build-only) build_only=true ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 1 ;;
esac
if [[ $# -gt 1 ]]; then
  usage >&2
  exit 1
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
course="$root/content/courses/machine-learning"
python="${EDTRACE_PYTHON:-$course/.venv/bin/python}"

if [[ -z "${EDTRACE_PYTHON:-}" && ! -x "$python" ]]; then
  bootstrap=python3
  if command -v python3.12 >/dev/null 2>&1; then
    bootstrap=python3.12
  fi
  "$bootstrap" -m venv "$course/.venv"
fi
if ! "$python" -c 'import edtrace, numpy, torch' >/dev/null 2>&1; then
  "$python" -m pip install -r "$course/requirements.txt"
fi

cd "$root"
EDTRACE_PYTHON="$python" PAGES_BASE_PATH=/Foundation pnpm build:edtrace

if [[ "$build_only" == true ]]; then
  echo '课件已更新，刷新本地页面即可。'
  exit 0
fi

preview="$root/.cache/machine-learning-preview"
mkdir -p "$preview"
ln -sfn "$root/apps/web/out" "$preview/Foundation"
port="${PREVIEW_PORT:-5180}"
echo "打开 http://127.0.0.1:$port/Foundation/courses/machine-learning/presentation/?trace=machine_learning"
echo '按 Ctrl+C 停止服务。若端口已被占用，请使用 --build-only，或指定 PREVIEW_PORT。'
exec "$python" -m http.server "$port" --bind 127.0.0.1 --directory "$preview"
