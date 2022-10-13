#!/usr/bin/env bash
export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
export NOTE_PROGRAM_ADDRESS="noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"
solana-test-validator --bpf-program ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} on-chain-programs/metaplex_token_metadata_program.so --bpf-program ${NOTE_PROGRAM_ADDRESS} on-chain-programs/note_program.so --reset
