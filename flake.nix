{
  description = "MCP Guardian";
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixgl.url = "github:nix-community/nixGL";
    # TODO: remove this when present 0.2.3 is upstreamed to nixpkgs
    nixpkgs-present-cli.url = "github:cameronfyfe/nixpkgs?ref=present-cli-0-2-3";
  };

  outputs = inputs:
    (inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import inputs.nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [
            inputs.rust-overlay.overlays.default
            inputs.nixgl.overlay
          ];
        };

        inherit (import inputs.nixpkgs-present-cli {
          inherit system;
        }) present-cli;

        inherit (pkgs) callPackage lib stdenv;
        inherit (lib) optionals;
        inherit (stdenv) hostPlatform;

        rust = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain;
        # rustfmt from rust-nightly used for advanced options in rustfmt
        rustfmt-nightly = pkgs.rust-bin.nightly.latest.rustfmt;

        shellPkgs = [
          present-cli
          rustfmt-nightly # must come before `rust` to so this version of rustfmt is first in PATH
          rust
        ] ++ (with pkgs; [
          cargo-tauri
          just
          mdbook
          nixpkgs-fmt
          openssl
          neovim
          nodejs_22
          pkg-config
          (yarn.override { nodejs = nodejs_22; })
        ]) ++ optionals hostPlatform.isLinux (with pkgs; [
          webkitgtk_4_1 # comes pre-installed on macOS
        ]);

      in
      {
        devShells = {
          default = pkgs.mkShell {
            shellHook = ''
              if [ "$(uname -s)" = "Linux" ]; then
                nix run --impure .#nixGL -- nix develop .#dev
              else
                nix develop .#dev
              fi
            '';
          };
          dev = pkgs.mkShell {
            buildInputs = shellPkgs;
            shellHook = ''
              export PATH="$(pwd)/_build/bin:$PATH"
              # optionally specify a shell to launch, otherwise it remains in bash
              if [ -f .devshell ]; then
                export SHELL=$(cat .devshell)
                exec $SHELL
              fi
            '';
            WEBKIT_DISABLE_COMPOSITING_MODE = 1;
          };
          fhs = (pkgs.buildFHSEnv {
            name = "fhs-shell";
            targetPkgs = _: shellPkgs;
          }).env;
        };

        packages = {
          # dev packages
          codium = callPackage ./nix/vscode.nix { vscode = pkgs.vscodium; };
          nixGL = pkgs.nixgl.auto.nixGLDefault;
          # release packages
          mcp-guardian = callPackage ./nix/mcp-guardian.nix { };
          mcp-guardian-cli = callPackage ./nix/mcp-guardian-cli.nix { };
          mcp-guardian-proxy = callPackage ./nix/mcp-guardian-proxy.nix { };
        };
      }));
}
