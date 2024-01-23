import {
  SendEthTransactionActionResolverEvents,
  SendEthTransactionActionResolverInit,
} from "@mod-protocol/core";
import {
  sendTransaction,
  switchNetwork,
  waitForTransaction,
} from "@wagmi/core";

export async function sendEthTransaction(
  { data, chainId }: SendEthTransactionActionResolverInit,
  { onConfirmed, onError, onSubmitted }: SendEthTransactionActionResolverEvents
) {
  try {
    const parsedChainId = parseInt(chainId);

    // Switch chains if the user is not on the right one
    await switchNetwork({ chainId: parsedChainId });

    // Send the transaction
    const { hash } = await sendTransaction({
      ...data,
      chainId: parsedChainId,
    });
    onSubmitted(hash);

    // Wait for the transaction to be confirmed
    const { status } = await waitForTransaction({
      hash,
      chainId: parsedChainId,
    });

    onConfirmed(hash, status === "success");
  } catch (e) {
    onError(e);
  }
}
