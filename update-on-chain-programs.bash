#!/usr/bin/env bash

# Token Metadata program
export METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS="metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
solana program dump -u m ${METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS} on-chain-programs/metaplex_token_metadata_program.so

# Memo program
export MEMO_PROGRAM_ADDRESS="MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
solana program dump -u m ${MEMO_PROGRAM_ADDRESS} on-chain-programs/memo_program.so

# Compute budget program
# Disabled per https://solana.stackexchange.com/questions/5600/error-downloading-the-computebudget-program-to-use-on-local-validator
# export COMPUTE_BUDGET_PROGRAM="ComputeBudget111111111111111111111111111111"
# solana program dump -u m ${COMPUTE_BUDGET_PROGRAM} on-chain-programs/compute_budget_program.so
