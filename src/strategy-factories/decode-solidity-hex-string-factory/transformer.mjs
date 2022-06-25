// @format
import { env } from "process";
import { resolve } from "path";

import { decodeCallOutput } from "eth-fun";

import logger from "../../logger.mjs";

export const decodeSolidityHexStringFactory = (props) => {
  const { strategyName, version, nextStrategyName, resultKey } = props;

  const log = logger(strategyName);

  function onClose() {
    if (strategyName) {
      const fileName = `${strategyName}-transformation`;
      return {
        write: null,
        messages: [
          {
            type: "extraction",
            version,
            name: nextStrategyName,
            args: [resolve(env.DATA_DIR, fileName)],
          },
        ],
      };
    }
    return {
      write: null,
      messages: [],
    };
  }

  function onError(error) {
    log(error.toString());
    throw error;
  }

  function onLine(line) {
    let obj;

    try {
      obj = JSON.parse(line);
    } catch (err) {
      log(err.toString());
      return {
        messages: [],
        error: err,
      };
    }

    let decodedOutput;
    try {
      [decodedOutput] = decodeCallOutput(["string"], obj.results);
    } catch (err) {
      log(err.toString());
      return {
        messages: [],
        write: err,
      };
    }
    return {
      messages: [],
      write: JSON.stringify({
        metadata: obj.metadata,
        [resultKey]: decodedOutput,
      }),
    };
  }

  return {
    onClose,
    onLine,
    onError,
  };
};
