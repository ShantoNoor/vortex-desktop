import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Folder, PanelRightClose } from "lucide-react";
import { useUiStore } from "../lib/store";

const initialData = {
  appState: { viewBackgroundColor: "#222" },
};

export const Editor = () => {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  const selectFolder = async () => {
    const data = await window.api.selectFolder();
    console.log(data);
  };

  return (
    <Excalidraw initialData={initialData}>
      <MainMenu>
        <MainMenu.Item icon={<Folder />} onClick={selectFolder}>
          Open Folder
        </MainMenu.Item>
        <MainMenu.Item icon={<PanelRightClose />} onClick={toggleSidebar}>
          Toggle Sidebar
        </MainMenu.Item>
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  );
};
