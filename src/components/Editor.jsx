import {
  Excalidraw,
  MainMenu,
  CaptureUpdateAction,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Folder, FolderPen, PanelRightClose, Save } from "lucide-react";
import { useUiStore } from "../lib/store";
import { useEffect, useRef, useState } from "react";
import { Loader } from "./Loader";
import { StartScreen } from "./StartScreen";

const initialData = {
  appState: { viewBackgroundColor: "#222" },
};

export const Editor = () => {
  const timeoutId = useRef("");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    toggleSidebar,
    setSavePath,
    setTree,
    activeFolder,
    setActiveFolder,
    savePath,
    autoSave,
    setAutoSave,
    selectFolder,
  } = useUiStore();

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 10);
  }, [activeFolder]);

  useEffect(() => {
    async function run() {
      if (activeFolder && excalidrawAPI) {
        const data = await window.api.openFile(activeFolder);

        if (data.success) {
          excalidrawAPI.updateScene({
            elements: data.elements,
            appState: data.appState,
            captureUpdate: CaptureUpdateAction.IMMEDIATELY,
          });

          excalidrawAPI.addFiles(data.files);
        }

        setAutoSave(true);
      }
    }
    run();
  }, [excalidrawAPI]);

  const handleSave = async (elements, appState, files) => {
    const data = await window.api.handleSave({
      activeFolder,
      elements,
      files,
      appState,
      savePath,
    });

    if (data.success && activeFolder === null) {
      setActiveFolder(data.activeFolder);
    }
  };

  const saveFile = async () => {
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();
    handleSave(elements, appState, files);
    setAutoSave(true);
  };

  if (!activeFolder) {
    return <StartScreen />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Excalidraw
      excalidrawAPI={(api) => setExcalidrawAPI(api)}
      initialData={initialData}
      onChange={(elements, appState, files) => {
        if (activeFolder && autoSave) {
          if (timeoutId.current) {
            clearTimeout(timeoutId.current);
          }
          timeoutId.current = setTimeout(() => {
            handleSave(elements, appState, files);
          }, 250);
        }
      }}
    >
      <MainMenu>
        <MainMenu.Item icon={<FolderPen />} onClick={selectFolder}>
          Open Folder
        </MainMenu.Item>
        <MainMenu.Item icon={<Save />} onClick={saveFile}>
          Save
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
