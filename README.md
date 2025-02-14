# MCP Guardian

[mcp-guardian.org](https://mcp-guardian.org)

## Overview

MCP Guardian manages your LLM assistant's access to MCP servers, handing you realtime control of your LLM's activity.

**📜 Message Logging** - See traces for all of an LLM's MCP server activity

**💂 Message Approvals** - Approve and deny individual tool call messages in real time

**🤖 Automated Message Scans** - Realtime automated checks for safety, privacy, etc (Coming Soon)

MCP Guardian also makes it a breeze to manage multiple MCP server configurations. Quickly switch between server collections without having to manually manage configuration files for your MCP host applications.

## Usage

**mcp-guardian**

`mcp-guardian` launches the desktop portal.

**mcp-guardian-cli**
```present mcp-guardian-cli --help
mcp-guardian-cli

Usage: mcp-guardian-cli <COMMAND>

Commands:
  guard-profiles      Commands related to guard-profile configurations
  mcp-servers         Commands related to mcp-server configurations
  server-collections  Commands related to server-collections configurations
  help                Print this message or the help of the given subcommand(s)

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
  -m, --mcp-server <MCP_SERVER>
          [Optional] MCP server configuration to use. This is mutually exclusive with providing a command to run
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
