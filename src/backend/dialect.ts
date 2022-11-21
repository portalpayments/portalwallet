// Common imports
import {
  Dialect,
  DialectCloudEnvironment,
  DialectSdk,
  Thread,
  ThreadId,
  type FindThreadByIdQuery,
} from "@dialectlabs/sdk";

// Solana-specific imports
import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
} from "@dialectlabs/blockchain-sdk-solana";

const environment: DialectCloudEnvironment = "development";

const sdk: DialectSdk<Solana> = Dialect.sdk(
  {
    environment,
  },
  SolanaSdkFactory.create({
    wallet: NodeDialectSolanaWalletAdapter.create(),
  })
);

// Fetch all threads the wallet is a part of, across all provided backends
const threads: Thread[] = await sdk.threads.findAll();

// Choose a given thread
const thread = threads[0];

// Fetch for a single thread by its id. N.b. the ThreadId type specifies both the address of the thread *as well as* the specified backend; threads of a given id may exist in any kind of backend. See the ThreadId type.
const query: FindThreadByIdQuery = {
  id: thread.id,
};
const thread = await sdk.threads.find(query);
// Call the messages() method to read messages
const messages = await thread.messages();
