#!/usr/bin/env bash
set -e

# Set writable cargo home
export CARGO_HOME="$HOME/.cargo"
export RUSTUP_HOME="$HOME/.rustup"
export PATH="$CARGO_HOME/bin:$PATH"

# Install Rust if not available
if ! command -v cargo &> /dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
    source "$CARGO_HOME/env"
else
    echo "Rust found: $(cargo --version)"
fi

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install with ONLY binary wheels - no compilation
pip install --only-binary :all: -r requirements.txt