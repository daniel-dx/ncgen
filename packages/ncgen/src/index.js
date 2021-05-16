import * as ncgenApi from "./api";
import lodash from "lodash";
import { generate as _generate } from "./cli";
import { log as _log } from "./utils";

export const api = ncgenApi;
export const log = _log;
export const _ = lodash;

/**
 * Call ncgen through node api form
 * @param {(string|object)} config - Configuration file path or configuration object
 * @param {object} options - Options
 * @param {string} options.type - "m" (main command) or "s" (subcommand)
 * @param {string} options.command - The name of the executed subcommand. Only needed when type is "s"
 * @param {object} options.answers - Provided when you want to skip interactive questioning
 * @returns {promise} Promise
 * @example
 * import { generate } from "ncgen"
 *
 * // Execute the main command
 * generate('path/to/ncgen-config.js', { type: 'm' })
 * // or
 * const ncgenConfig = require('path/to/ncgen-config.js')
 * generate(ncgenConfig, { type: 'm' })
 *
 * // Execute the main command with answer data
 * generate('path/to/ncgen-config.js', { type: 'm', answers: { projectName: 'demo', author: 'daniel' } })
 *
 * // Execute the sub command
 * generate('path/to/ncgen-config.js', { type: 's', command: 'add-component' })
 *
 * // Execute the sub command with answer data
 * generate('path/to/ncgen-config.js', { type: 's', command: 'add-component', answers: { category: 'busi', name: 'hello world' } })
 *
 */
export function generate(config, options) {
  return _generate(config, options, false);
}
