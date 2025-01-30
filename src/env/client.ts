import type { StandardSchemaV1 } from "@t3-oss/env-core"

import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
    console.error("❌ Invalid client environment variables ❌", issues)
    // It's ok to disable lint below because
    // we do want to exit in case of an error.
    // eslint-disable-next-line n/no-process-exit
    process.exit(1)
  },
  runtimeEnv: {
    /* eslint-disable n/no-process-env */
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    /* eslint-enable n/no-process-env */
  },
  emptyStringAsUndefined: true,
})
