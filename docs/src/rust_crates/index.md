# Rust Crates

## mcp-guardian-core

`mcp-guardian-core` is a library crate holding most of the core application logic for MCP Guardian. It's consumed by [`mcp-guardian`](./mcp_guardian.md), [`mcp-guardian-cli`](./mcp_guardian_cli.md), and [`mcp-guardian-proxy`](./mcp_guardian_proxy.md).

## mcp-guardian

`mcp-guardian` is a GUI application and is the primary user interface for MCP Guardian. It's built with Rust and React using [Tauri](https://v2.tauri.app/).

## mcp-guardian-proxy

`mcp-guardian-proxy` is a CLI tool for running MCP proxy servers managed by MCP Guardian. This binary should be installed in `PATH` on your system so it can be launched by MCP hosts you want to control with MCP Guardian.

## mcp-guardian-cli

`mcp-guardian-cli` is a CLI application and is meant to provide all the same functionality as the GUI application for users preferring a terminal-based workflows.
