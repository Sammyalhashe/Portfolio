{
  description = "A Next.js project flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11"; # Using a stable NixOS channel
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            npm
            git
            yarn
          ];

          shellHook = ''
            echo "Entering Next.js development shell..."
            npm install
            echo "To start the development server, run: npm run dev"
          '';
        };
      });
}
