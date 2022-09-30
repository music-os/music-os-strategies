// @format
import { resolve } from "path";
import { env } from "process";

import logger from "../../logger.mjs";

export const name = "noizd-get-tokenuri";
const log = logger(name);
export const version = "0.1.0";

export function onClose() {
  log("closed");
  return {
    write: null,
    messages: [],
  };
}

export function onError(error) {
  log(error.toString());
  throw error;
}

export function onLine(line) {
  const obj = JSON.parse(line);
  const datum = obj.results;
  return {
    messages: [],
    write: JSON.stringify({
      version,
      title: datum.name,
      artist: {
        version,
        name: datum.artist_name,
      },
      platform: {
        version,
        name: "Noizd",
        uri: "https://noizd.com",
      },
      erc721: {
        version,
        // TODO: Stop hard coding this value
        owner: "0x4456AE02EA5534cEd3A151e41a715bBA685A7CAb",
        createdAt: obj.metadata.block.number,
        tokenId: obj.metadata.tokenId,
        address: obj.metadata.contract.address,
        tokenURI: obj.metadata.tokenURI,
        metadata: {
          ...datum,
        },
      },
      manifestations: [
        {
          version,
          uri: datum.audio_url,
          mimetype: "audio",
        },
        {
          version,
          uri: datum.image,
          mimetype: "image",
        },
      ],
    }),
  };
}
