import RoutesScreen from "@/components/RoutesScreen";

// A5 · Map home, location off: browsing Berlin and Brandenburg, or after the location is declined.

export default function Region() {
  return <RoutesScreen near={false} />;
}
