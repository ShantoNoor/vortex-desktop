import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  getFiles: (path) => ipcRenderer.invoke("get-files", path),
  handleSave: (payload) => ipcRenderer.invoke("save-file", payload),
  openFile: (activeFolder) => ipcRenderer.invoke("open-file", activeFolder),
});
