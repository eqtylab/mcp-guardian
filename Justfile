_:
    @just --list

fmt:
    just do-all fmt
    nixpkgs-fmt .

fmt-check:
    just do-all fmt-check
    nixpkgs-fmt --check .

lint:
    just do-all lint

build:
    just do-all build

build-release:
    just do-all build-release

test:
    cargo test

clean:
    just do-all clean
    rm -rf _build tmp

readme-update:
    present --in-place README.md

readme-check: _tmp
    present README.md > tmp/README.md
    diff README.md tmp/README.md

do DIR +RECIPE:
    cd {{DIR}} && just {{RECIPE}}

do-all +RECIPE:
    just do mcp-guardian-core {{RECIPE}}
    just do mcp-guardian-cli {{RECIPE}}
    just do mcp-guardian {{RECIPE}}
    just do mcp-guardian-proxy {{RECIPE}}
    just do docs {{RECIPE}}

_tmp:
    mkdir -p tmp
