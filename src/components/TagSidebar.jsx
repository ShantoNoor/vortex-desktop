import { useEffect, useReducer, useState } from "react";
import { useUiStore } from "../lib/store";
import { Input } from "./ui/input";
import { Link } from "lucide-react";

const TagSidebar = () => {
  const [tags, setTags] = useState([]);
  const [tagsFiltered, setTagsFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const { setActiveFolder, activeFolder, setScrollElement, savePath } =
    useUiStore();
  const [relativeActiveFolder, setRelativeActiveFolder] =
    useState(activeFolder);

  useEffect(() => {
    (async function () {
      if (activeFolder && savePath) {
        const res = await window.api.relativePath(savePath, activeFolder);
        setRelativeActiveFolder(res);
      }
    })();
  }, [activeFolder]);

  useEffect(() => {
    (async function () {
      const data = await window.db.all();
      setTags(data);
      setTagsFiltered(data);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (search !== "") {
        const data = await window.db.searchTag(search);
        setTagsFiltered(data);
      } else {
        setTagsFiltered(tags);
      }
    })();
  }, [search]);

  if (!savePath) {
    return (
      <div className="h-full w-full flex justify-center items-center text-3xl">
        First, Open a folder!...
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center text-3xl">
        No tags found!..
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden h-dvh no-scrollbar">
      <div className="sticky top-0 z-10 bg-[#111] w-full">
        <Input
          placeholder="Search here..."
          value={search}
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none"
        />
      </div>
      {tagsFiltered.map((t) => (
        <div
          key={t.id}
          className={`min-h-8 text-lg m-0 min-w-screen overflow-x-hidden px-2 py-1 border rounded-none cursor-pointer hover:bg-[#222] transition-colors flex flex-col justify-center ${t.activeFolder === relativeActiveFolder ? "bg-[#222]" : ""}`}
          onClick={async () => {
            const tactiveFolder = await window.api.joinPath([
              savePath,
              t.activeFolder,
            ]);
            if (tactiveFolder === activeFolder) {
              setScrollElement(t.element);
            } else {
              if (
                !activeFolder &&
                !confirm("Sure ? Unsaved progress will be lost ...")
              ) {
                return;
              }
              setActiveFolder(tactiveFolder);
              setScrollElement(t.element);
            }
          }}
        >
          <div className="flex items-center gap-1">
            <Link className="size-4" />
            <p className="flex-1">{t.tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagSidebar;
