import { useUiStore } from "../lib/store";
import { Button } from "./ui/button";

export const StartScreen = () => {
  const openSidebar = useUiStore((state) => state.openSidebar);
  return (
    <div
      style={{ height: "100dvh", width: "100%" }}
      className="bg-[#222] flex justify-center items-center"
    >
      <Button
        variant="outline"
        size="lg"
        className="border-2"
        onClick={openSidebar}
      >
        Open Sidebar
      </Button>
    </div>
  );
};
