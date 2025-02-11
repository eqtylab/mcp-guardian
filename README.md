# MCP Guardian

## Overview

MCP Guardian enables visibility and control over all of an AI agent's MCP-based activity.

MCP Guardian does not have to be deeply integrated into an AI agent's host application. It can simply proxy MCP traffic from a closed host like [Claude Desktop](https://claude.ai/download) to provide additional visibility and granular control to the host's activity.

## MCP Guardian Desktop Portal

MCP Guardian's desktop portal facilitates management of proxy configurations, visibility to logs, and a UI showing status of automated gate checks and manual control of outbound and inbound MCP messages.

## MCP Guardian Proxy

MCP Guardian can be configured to proxy any number of MCP servers. For each MCP server proxied with MCP guardian you can configure
- MCP message logging
- MCP message gate checks
  - Automated: scan messages with built in guards or custom logic extensions
  - Manual: approve and deny individual messages in real time

## Usage

**mcp-guardian**

`mcp-guardian` launches the desktop portal.

**mcp-guardian-cli**
```present mcp-guardian-cli --help
mcp-guardian-cli

Usage: mcp-guardian-cli <COMMAND>

Commands:
  guard-profiles  Commands related to guard-profile configurations
  mcp-servers     Commands related to mcp-server configurations
  help            Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
```

**mcp-guardian-proxy**
```present mcp-guardian-proxy --help
mcp-guardian-proxy

Usage: mcp-guardian-proxy [OPTIONS] [-- [CMD]...]

Arguments:
  [CMD]...  MCP server command

Options:
  -n, --name <NAME>
          [Optional] MCP server name
      --host-session-id <HOST_SESSION_ID>
          [Optional] Host session id
  -g, --guard-profile <GUARD_PROFILE>
          Guard profile to use for the MCP server ("{namespace}.{profile_name}") [default: mcp-guardian.default]
  -h, --help
          Print help
```

## Development

This project uses [nix](https://nixos.org/) to manage a development environment that can be used on Linux and macOS.

### Quick Start - Linux / macOS

1. [Install nix](https://nixos.org/download/)

2. Enable nix flakes
```bash
sudo sh -c 'echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf'
```

3. Enter dev shell
```bash
nix develop
```

4. Build project
```bash
just build-release
```

5. `mcp-guardian` and `mcp-guardian-proxy` are now in `_build/bin/` which is in `PATH` of the dev shell.

### Quick Start - Windows

```
TODO
```

### Justfile

```present just --list
Available recipes:
    build
    build-release
    clean
    do DIR +RECIPE
    do-all +RECIPE
    fmt
    fmt-check
    lint
    readme-check
    readme-update
    test
```
