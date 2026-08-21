#!/usr/bin/env bash
set -e

# Set writable cargo home (Render's /usr/local is read-only)
export CARGO_HOME="$HOME/.cargo"
export RUSTUP_HOME="$HOME/.rustup"
export PATH="$CARGO_HOME/bin:$PATH"

# Install Rust if not available in writable location
if ! command -v cargo &> /dev/null; then
    echo "Installing Rust to $CARGO_HOME..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
    source "$CARGO_HOME/env"
else
    echo "Rust found: $(cargo --version)"
fi

# Upgrade pip and install with pre-built wheels preference
pip install --upgrade pip setuptools wheel
pip install --prefer-binary -r requirements.txt