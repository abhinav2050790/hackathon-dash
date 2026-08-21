#!/usr/bin/env bash
set -e

# Install Rust for packages that need compilation (tokenizers, pydantic-core, etc.)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Upgrade pip and install
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt