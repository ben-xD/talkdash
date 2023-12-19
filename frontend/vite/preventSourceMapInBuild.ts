import * as fs from "fs";
import { PluginOption } from "vite";

export const preventSourceMapInBuild: PluginOption = {
  name: "prevent-source-map-in-build",
  // Run it after sentry is finished
  enforce: "post",
  writeBundle(outputOptions) {
    // We know it'll be string array because we don't use `buffer` parameter.
    // See https://nodejs.org/api/fs.html#fsreaddirsyncpath-options
    const files = fs.readdirSync(outputOptions.dir, {
      recursive: true,
    }) as string[];

    const sourceMapFiles = files.filter((file) => file.endsWith(".map"));

    if (sourceMapFiles.length > 0) {
      throw new Error(
        `Error: ${
          sourceMapFiles.length
        } source map files found in the build directory: ${sourceMapFiles.join(
          ", ",
        )}`,
      );
    }
  },
};
