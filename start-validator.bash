#!/usr/bin/env bash
export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
export MEMO_PROGRAM_ADDRESS="MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
solana-test-validator --bpf-program ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} on-chain-programs/metaplex_token_metadata_program.so --bpf-program ${MEMO_PROGRAM_ADDRESS} on-chain-programs/memo_program.so --reset
