#!/usr/bin/env bash

function get_cargo_toml_version() {
    echo $(grep -oP 'version = "\K[0-9]+\.[0-9]+\.[0-9]+' $1/Cargo.toml)
}

function get_package_json_version() {
    echo $(grep -oP '"version": "\K[0-9]+\.[0-9]+\.[0-9]+' $1/package.json)
}

version=$(get_package_json_version mcp-guardian)

if [ "$version" != $(get_cargo_toml_version mcp-guardian-core) ]; then
    echo "Version mismatch between mcp-guardian/package.json and mcp-guardian-core/Cargo.toml"
    exit 1
fi

if [ "$version" != $(get_cargo_toml_version mcp-guardian-proxy) ]; then
    echo "Version mismatch between mcp-guardian/package.json and mcp-guardian-proxy/Cargo.toml"
    exit 1
fi

if [ "$version" != $(get_cargo_toml_version mcp-guardian-cli) ]; then
    echo "Version mismatch between mcp-guardian/package.json and mcp-guardian-cli/Cargo.toml"
    exit 1
fi

if [ "$version" != $(get_cargo_toml_version mcp-guardian/src-tauri) ]; then
    echo "Version mismatch between mcp-guardian/package.json and mcp-guardian/src-tauri/Cargo.toml"
    exit 1
fi

echo $version

