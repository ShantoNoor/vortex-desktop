import { useEffect, useState } from "react";
import { useUiStore } from "../lib/store";
import { Input } from "./ui/input";

const TagViewer = ({ activeFolder, savePath }) => {
  const [tags, setTags] = useState([]);
  const [tagsFiltered, setTagsFiltered] = useState([]);

  const [search, setSearch] = useState("");

  const setScrollElement = useUiStore((state) => state.setScrollElement);

  useEffect(() => {
    (async function () {
      const data = await window.db.getByFolder({ activeFolder, savePath });
      setTags(data);
      setTagsFiltered(data);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (search !== "") {
        const data = await window.db.searchTagInFolder({
          search,
          activeFolder,
          savePath,
        });
        setTagsFiltered(data);
      } else {
        setTagsFiltered(tags);
      }
    })();
  }, [search]);

  if (tags.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center text-3xl">
        No tags found!..
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="sticky top-0 z-10 bg-[#111] w-full">
        <Input
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none"
          type="search"
        />
      </div>
      {tagsFiltered.map((t) => (
        <div
          key={t.id}
          className="min-h-8 m-2 border px-2 py-1 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => {
            setScrollElement(t.element);
          }}
        >
          <p>{t.tag}</p>
        </div>
      ))}
    </div>
  );
};

export default TagViewer;
