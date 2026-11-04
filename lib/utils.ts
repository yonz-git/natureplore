// cn(), the class joiner the shadcn components in components/ui use: clsx, then tailwind-merge so a later
// utility wins over an earlier one of the same property.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
