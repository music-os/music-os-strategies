// @format
import { ifIpfsConvertToNativeIpfs } from "ipfs-uri-utils";

import logger from "../../logger.mjs";

export const name = "soundxyz-get-tokenuri";
const log = logger(name);
export const version = "0.1.0";

export function onClose() {
  log("closed");
  return;
}

export function onError(error) {
  log(error.toString());
  throw error;
}

export function onLine(line) {
  const obj = JSON.parse(line);
  const datum = obj.results;
  return JSON.stringify({
    version,
    title: datum.name,
    // TODO
    //duration: "PT0M",
    artist: {
      version,
      name: datum.artist_name,
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://sound.xyz",
    },
    erc721: {
      version,
      // TODO
      //address: nft[1],
      //tokenId: nft[2],
      tokenURI: obj.metadata.tokenURI,
      metadata: {
        ...datum,
      },
    },
    manifestations: [
      {
        version,
        uri: ifIpfsConvertToNativeIpfs(datum.audio_url),
        mimetype: "audio",
      },
      {
        version,
        uri: ifIpfsConvertToNativeIpfs(datum.image),
        mimetype: "image",
      },
      {
        version,
        uri: ifIpfsConvertToNativeIpfs(datum.animation_url),
        mimetype: "image",
      },
    ],
  });
}
