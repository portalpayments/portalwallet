#!/usr/bin/env bash
export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
solana-test-validator --bpf-program ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} on-chain-programs/metaplex_token_metadata_program.so --reset
