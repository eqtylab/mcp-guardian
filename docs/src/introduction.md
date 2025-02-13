# Introduction

MCP Guardian is a tool for managing visibility and control of LLM-based agent activity.

MCP Guardian leverages [Model Context Protocol](https://github.com/modelcontextprotocol), an open protocol for communication between LLM applications and external data/tool providers. [Claude Desktop](https://claude.ai/download), {TODO: add more hosts}, as well as many useful external plugins (MCP servers) support the protocol.

Because of MCP's open spec, MCP Guardian doesn't need to be deeply integrated in an LLM's host application to manage its activity. It simply proxies MCP traffic from an existing host (like Claude Desktop) to provide visibility and granular control of the LLM's activity.
