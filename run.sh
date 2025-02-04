#!/usr/bin/env bash

nix run --impure .#nixGL -- nix develop .#dev -c $@ 
