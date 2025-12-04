import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Edit, Trash, X } from "lucide-react";

const TagManager = ({ selectedElementId, activeFolder }) => {
  const [tag, setTag] = useState("");
  const [edit, setEdit] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await window.db.getByElement(selectedElementId);
      setTags(
        data.map((it) => {
          return { ...it, edit: false };
        })
      );
    })();
  }, []);

  if (!activeFolder) {
    return (
      <div className="h-full w-full flex justify-center items-center text-3xl">
        Save First!...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <div className="sticky top-0 bg-[#111]!">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Write tag here..."
            className="rounded-none "
          />
          <Button
            variant="outline"
            className="w-full my-2"
            onClick={async () => {
              if (tag.trim() === "") return alert("Tag is empty");
              const id = await window.db.create({
                tag: tag.trim(),
                element: selectedElementId,
                activeFolder,
              });
              setTags((t) => [
                ...t,
                {
                  id,
                  tag,
                  element: selectedElementId,
                  activeFolder,
                  edit: false,
                },
              ]);
              setTag("");
            }}
          >
            Add Tag
          </Button>
          <hr></hr>
        </div>

        {tags.map((t) => (
          <div
            key={t.id}
            className="min-h-8 m-2 border flex gap-1 items-center justify-between px-2 py-1 rounded-md hover:border-blue-400 transition-colors"
          >
            {!t.edit ? (
              <>
                <p className="flex-1">{t.tag}</p>
                <Edit
                  className="cursor-pointer size-3"
                  onClick={() => {
                    setEdit(t.tag);
                    setTags((its) =>
                      its.map((it) =>
                        it.id !== t.id ? it : { ...it, edit: true }
                      )
                    );
                  }}
                />
                <Trash
                  className="cursor-pointer size-3"
                  onClick={async () => {
                    if (!confirm("Sure? You want to delete ...")) return;
                    const res = await window.db.delete(t.id);
                    if (res) {
                      setTags((pt) => pt.filter((i) => i.id !== t.id));
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Input
                  value={edit}
                  onChange={(e) => setEdit(e.target.value)}
                  className="h-7"
                />
                <Check
                  className="cursor-pointer size-3"
                  onClick={async () => {
                    if (edit.trim() === "")
                      return alert("Can not update empty value.");

                    const res = await window.db.update(t.id, {
                      tag: edit,
                      element: selectedElementId,
                      activeFolder,
                    });
                    const { changes } = res;

                    if (changes === 1) {
                      setEdit("");
                      setTags((its) =>
                        its.map((it) =>
                          it.id !== t.id
                            ? it
                            : { ...it, edit: false, tag: edit }
                        )
                      );
                    }
                  }}
                />
                <X
                  className="cursor-pointer size-3"
                  onClick={() => {
                    setTags((its) =>
                      its.map((it) =>
                        it.id !== t.id ? it : { ...it, edit: false }
                      )
                    );
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TagManager;
