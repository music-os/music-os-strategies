// @format
import { callTokenUriFactory } from "../../strategy-factories/call-tokenuri/extractor.mjs";

export const version = "0.0.1";
export const name = "zora-drops-call-tokenuri";
export const props = {
  version,
  strategyName: name,
  signature: {
    name: "tokenURI",
    type: "function",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
  },
  filterFunc: ({ platform }) => platform.name === "zora-drops",
};

const { init, update } = callTokenUriFactory(props);

export { init, update };