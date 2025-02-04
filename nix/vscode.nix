{ vscode, vscode-extensions, vscode-with-extensions }:

vscode-with-extensions.override {
  inherit vscode;
  vscodeExtensions = with vscode-extensions; [
    asvetliakov.vscode-neovim
    bbenoist.nix
    rust-lang.rust-analyzer
    skellock.just
    tamasfe.even-better-toml
    tauri-apps.tauri-vscode
  ];
}
