# Installing - Linux

This page explains how to install MCP Guardian on Linux using prebuilt binaries from [Github Releases](https://github.com/eqtylab/mcp-guardian/releases/latest).

## [1] Install `mcp-guardian`

Download

- `mcp-guardian_x86_64-linux.AppImage`

or

- `mcp-guardian_x86_64-linux`

The AppImage is much easier to use, but if you know how to get dependencies installed properly the native binary is provided as another option.

Rename the binary and make it executible:

```bash
mv mcp-guardian_x86_64-linux.AppImage mcp-guardian.AppImage
chmod +x mcp-guardian.AppImage
```

To test it works on your system, double click it from a file explorer that can launch executables or launch it from the command line. You should see the GUI window open.

## [2] Install `mcp-guardian-proxy`

Download

- `mcp-guardian-proxy_x86_64-linux`

Rename the binary and make it executible:

```bash
mv mcp-guardian-proxy_x86_64-linux mcp-guardian-proxy
chmod +x mcp-guardian-proxy
```

We recommend you place `mcp-guardian-proxy` somewhere in your system's `PATH` so it can be more conveniently used by MCP Guardian, however this is not required.

Test it works on your system:

```bash
mcp-guardian-proxy --help`
```

You should see a help message with usage.

## [Optional] Install `mcp-guardian-cli`

The MCP Guardian GUI (`mcp-guaridan`) and `mcp-guardian-proxy` are all that need be installed to use MCP Guardian, but `mcp-guardian-cli` is available for users who would prefer a terminal based workflow to the GUI.

Download

- `mcp-guardian-cli_x86_64-linux`

Rename the binary and make it executible:

```bash
mv mcp-guardian-proxy_x86_64-linux mcp-guardian-proxy
chmod +x mcp-guardian-proxy
```

Test it works on your system:

```bash
mcp-guardian-cli --help`
```

You should see a help message with usage.

## After Installing

Once you have binaries installed on your system, see the [Tutorial](../tutorial/index.md) to quickly get up and running with MCP Guardian.
