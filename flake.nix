{
  description = "My personal profile and blogger site";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        nodejs = pkgs.nodejs_24;
        buildInputs = with pkgs; [
          nodejs
          # Add other system dependencies here
        ];
      in
      {
        devShell = pkgs.mkShell {
          inherit buildInputs;
          shellHook = ''
            npm install
          '';
        };
      }
    );
}
