import { Suspense } from "react";
import View from "./view";

// Signed-in page, rendered per request behind the session check.
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <View />
    </Suspense>
  );
}
