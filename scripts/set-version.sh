#!/usr/bin/env bash

VERSION=$1

set_cargo_toml_version() {
    cd $1

    # update version in Cargo.toml
    sed -i "s/version = \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version = \"$VERSION\"/g" Cargo.toml
    # update version in Cargo.lock
    cargo check

    cd -
}

set_package_json_version() {
    cd $1

    # update version in package.json
    sed -i "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/g" package.json
    # update yarn.lock
    yarn

    cd -
}

set_cargo_toml_version mcp-guardian-core

set_cargo_toml_version mcp-guardian-proxy

set_cargo_toml_version mcp-guardian-cli

set_package_json_version mcp-guardian
set_cargo_toml_version mcp-guardian/src-tauri

