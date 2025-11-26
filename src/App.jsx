import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Editor } from "./components/Editor";
import { useUiStore } from "./lib/store";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function App() {
  const shwoSidebar = useUiStore((state) => state.shwoSidebar);

  return (
    <SidebarProvider>
      <ResizablePanelGroup direction="horizontal" className="min-h-[100dvh]">
        {shwoSidebar && (
          <>
            <ResizablePanel id="sidebar" defaultSize={25} order={1}>
              <AppSidebar />
            </ResizablePanel>
            <ResizableHandle className="bg-[#333]" />
          </>
        )}
        <ResizablePanel id="main" order={2}>
          <Editor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarProvider>
  );
}
