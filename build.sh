#!/usr/bin/env bash
set -e

# Check if Rust/cargo already available
if command -v cargo &> /dev/null; then
    echo "Rust already installed: $(cargo --version)"
else
    echo "Installing Rust..."
    # Install rustup to user-writable location
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
    source "$HOME/.cargo/env"
fi

# Upgrade pip and install
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt