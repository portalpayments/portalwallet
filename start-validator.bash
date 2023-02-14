#!/usr/bin/env bash
export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
# Disabled per https://solana.stackexchange.com/questions/5600/error-downloading-the-computebudget-program-to-use-on-local-validator
# export COMPUTE_BUDGET_PROGRAM="ComputeBudget111111111111111111111111111111"
export MEMO_PROGRAM_ADDRESS="MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"

solana-test-validator \
  --bpf-program ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} on-chain-programs/metaplex_token_metadata_program.so \
  --bpf-program ${MEMO_PROGRAM_ADDRESS} on-chain-programs/memo_program.so \
  --reset
