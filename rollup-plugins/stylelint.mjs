import path from 'node:path';
import stylelint from 'stylelint';

const { lint, formatters } = stylelint;

function resultHasErrors(result) {
  return result.results.some((res) => res.errored);
}

function resultHasWarnings(result) {
  return result.results.some((res) => res.warnings.length !== 0);
}

export default function stylelintPlugin({
  formatter = 'string',
  throwOnError,
  throwOnWarning,
  ...options
}) {
  return {
    name: 'stylelint',
    async buildStart() {
      try {
        const result = await lint({
          formatter,
          ...options,
        });

        if (!result.output) {
          return;
        }

        process.stdout.write(result.output);

        if (resultHasWarnings(result) && throwOnWarning) {
          throw new Error('Warning(s) were found');
        }

        if (resultHasErrors(result) && throwOnError) {
          throw new Error('Error(s) were found');
        }

        return null;
      } catch (err) {
        throw err;
      }
    },
  };
}
