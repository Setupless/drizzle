import createdAt from "./createdAt.js";
import updatedAt from "./updatedAt.js";

/**
 * Defines non-null `createdAt` and `updatedAt` text columns.
 */
export default function timestamps() {
  return {
    ...createdAt(),
    ...updatedAt(),
  };
}
