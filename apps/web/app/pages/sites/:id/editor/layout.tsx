import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className={cn("flex", "w-full")}>
      <Outlet />
    </div>
  );
}
