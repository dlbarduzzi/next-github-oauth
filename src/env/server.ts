import type { StandardSchemaV1 } from "@t3-oss/env-core"

import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
  },
  onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
    console.error("❌ Invalid server environment variables ❌", issues)
    // It's ok to disable lint below because
    // we do want to exit in case of an error.
    // eslint-disable-next-line n/no-process-exit
    process.exit(1)
  },
  /* eslint-disable n/no-process-env */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATIONS === "true",
  /* eslint-enable n/no-process-env */
})
