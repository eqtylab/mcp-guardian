{ stdenv
, rustPlatform
, fetchYarnDeps
, fixup-yarn-lock
, cargo-tauri
, nodejs
, openssl
, pkg-config
, webkitgtk_4_1
, yarn
}:

let

  cargoToml = builtins.fromTOML (builtins.readFile ../mcp-guardian/src-tauri/Cargo.toml);

in
rustPlatform.buildRustPackage rec {
  pname = cargoToml.package.name;

  version = cargoToml.package.version;

  src = ../.;

  cargoLock = { lockFile = ../Cargo.lock; };

  yarnOfflineCache = fetchYarnDeps {
    yarnLock = ../mcp-guardian/yarn.lock;
    hash = "sha256-awqX1L29245IiMwAB0U5j6ZmBw6M9AmRm4Za6IuLL5A=";
  };

  buildAndTestSubdir = "mcp-guardian";

  nativeBuildInputs = [
    cargo-tauri.hook
    fixup-yarn-lock
    nodejs
    pkg-config
    yarn
  ];

  buildInputs = [
    openssl
    webkitgtk_4_1
  ];

  preBuild = ''
    export HOME="$TMPDIR"

    pushd mcp-guardian

    chmod u+w . ./yarn.lock
    export HOME=$PWD/tmp
    mkdir -p $HOME
    yarn config --offline set yarn-offline-mirror $yarnOfflineCache
    fixup-yarn-lock yarn.lock
    yarn install --offline --frozen-lockfile --ignore-platform --ignore-scripts --no-progress --non-interactive
    patchShebangs node_modules/

    popd
  '';
}
