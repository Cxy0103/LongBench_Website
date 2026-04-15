#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-5174}"
MAX_PORT_TRIES="${MAX_PORT_TRIES:-20}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

is_port_free() {
  python3 - "$1" <<'PY'
import socket
import sys

port = int(sys.argv[1])
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
try:
    sock.bind(("0.0.0.0", port))
except OSError:
    sys.exit(1)
finally:
    sock.close()
PY
}

START_PORT="$PORT"
for _ in $(seq 1 "$MAX_PORT_TRIES"); do
  if is_port_free "$PORT"; then
    break
  fi
  echo "Port $PORT is already in use, trying $((PORT + 1))..."
  PORT=$((PORT + 1))
done

if ! is_port_free "$PORT"; then
  echo "No free port found from $START_PORT to $PORT." >&2
  echo "Try a specific port, for example: PORT=5180 ./command.sh" >&2
  exit 1
fi

SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"

echo "LongBench Website"
echo "Root: $ROOT_DIR"
echo "Listening: $HOST:$PORT"
echo
echo "Open from the server:"
echo "  http://127.0.0.1:$PORT"

if [ -n "$SERVER_IP" ]; then
  echo
  echo "Open from your local browser if this server port is reachable:"
  echo "  http://$SERVER_IP:$PORT"
fi

echo
echo "If direct access is blocked, run this on your local machine:"
echo "  ssh -L $PORT:127.0.0.1:$PORT <user>@<server>"
echo "Then open:"
echo "  http://127.0.0.1:$PORT"
echo

python3 -m http.server "$PORT" --bind "$HOST"
