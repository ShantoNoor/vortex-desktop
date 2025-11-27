import fs from "fs/promises"; // Fixed: Import 'promises' version to use await
import path from "path"; // Fixed: Missing path import

let ids = new Set();

export async function addFiles(fileList, activeFolder) {
  const imagesDir = path.join(activeFolder, "images");

  try {
    // 1. Ensure directory exists before writing
    await fs.mkdir(imagesDir, { recursive: true });

    const newlyAddedFiles = fileList.filter((file) => !ids.has(file.id));

    // 2. Use Promise.all for concurrent writing (much faster than sequential loop)
    await Promise.all(
      newlyAddedFiles.map(async (newFile) => {
        ids.add(newFile.id);
        try {
          await fs.writeFile(
            path.join(imagesDir, `${newFile.id}.json`),
            JSON.stringify(newFile, null, 2) // Optional: Pretty print JSON
          );
        } catch (e) {
          console.error(`Failed to write file: ${newFile.id}.json`, e);
        }
      })
    );
  } catch (error) {
    console.error(`Failed to add files process: ${error.message}`);
  }
}

export async function getFiles(idList, activeFolder) {
  // Warning: This overwrites the global set. Ensure this is intended behavior.
  ids = new Set(idList);
  const imagesDir = path.join(activeFolder, "images");

  try {
    // 3. Use Promise.all to read files in parallel
    const filePromises = idList.map(async (fileId) => {
      try {
        const fileJson = await fs.readFile(
          path.join(imagesDir, `${fileId}.json`),
          "utf-8" // Fixed: Specify encoding to get string instead of Buffer
        );
        return JSON.parse(fileJson);
      } catch (e) {
        console.error(`Failed to read file: ${fileId}.json`, e);
        return null; // Return null on failure so we can filter later
      }
    });

    const results = await Promise.all(filePromises);

    // Filter out any nulls from failed reads
    return results.filter((file) => file !== null);
  } catch (error) {
    console.error(`Failed to get files process: ${error.message}`);
    return [];
  }
}
