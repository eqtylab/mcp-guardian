{ rustPlatform
}:

let

  cargoToml = builtins.fromTOML (builtins.readFile ../mcp-guardian-proxy/Cargo.toml);

in

rustPlatform.buildRustPackage rec {
  pname = cargoToml.package.name;

  version = cargoToml.package.version;

  src = ../.;

  cargoLock = { lockFile = ../Cargo.lock; };

  buildAndTestSubdir = "mcp-guardian-proxy";
}
