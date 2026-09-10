import createdAt from "./createdAt.js";
import updatedAt from "./updatedAt.js";

/**
 * Defines non-null `createdAt` and `updatedAt` timestamp columns.
 */
export default function timestamps({
  withTimezone,
}: {
  withTimezone?: boolean;
} = {}) {
  return {
    ...createdAt({ withTimezone }),
    ...updatedAt({ withTimezone }),
  };
}
