import fs from "fs";
import { dirname } from "path";
// /v1/verse/1001001/relations?translation=NIV look into this later

// 66 books in the bible GEN - REV
async function getData() {
  let bible = [];
  //https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n/28079480
  const bookIds = [...Array(1).keys()].map((foo) => foo + 1);
  console.log(bookIds);

  await Promise.all(
    bookIds.map(async (bookID) => {
      let chapters = [];

      for (let i = 1; i <= (await getNumChapters(bookID)); i += 1) {
        const obj = await getChapter(bookID, i);

        chapters[obj[0].chapterId - 1] = obj;
      }

      bible[bookID - 1] = chapters;
    })
  );
  return bible;
}

// Helper funcs :)

async function getNumChapters(bookID) {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books/${bookID}/chapters?translation=NIV`
  );
  const obj = await response.json();

  return obj.length;
}

async function getChapter(bookID, chapter) {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books/${bookID}/chapters/${chapter}?translation=NIV`
  );
  const obj = await response.json();

  if (!obj.length || obj.length === 0) return false;

  return obj;
}

function makeFolder(path) {
  const filePath = `${process.cwd()}/${path}`;
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
  } catch (err) {
    console.error(err);
  }
}

function writeFile(path, fileData) {
  const filePath = `${process.cwd()}/${path}`;
  fs.writeFileSync(filePath, fileData);
  // this appears to confirm every verse page is created
  try {
    fs.readFileSync(filePath);
  } catch {
    console.log(`${path} failed`);
  }
}

const bible = await getData();
if (bible) {
  console.log("Aquired Bible Data!");
}

function getFileName(verse) {
  return `${verse.book.name}_${verse.chapterId}_${verse.verseId}.md`;
}

// make file structure
makeFolder("/Bible");
makeFolder("/Bible/Genesis");

let bookPage = "";
bible[0].forEach((chapter, chapterIndex, chapters) => {
  bookPage += `# Chapter ${chapter[0].chapterId}\n`;
  chapter.forEach((verse, verseIndex, verses) => {
    let fileName = getFileName(verse);
    let fileNameSpaces = fileName.replaceAll("_", " ").replaceAll(".md", "");
    let versePage = "";

    // Frontmatter for verse page
    versePage += `---\n`;
    versePage += `alias: "${fileNameSpaces}"\n`;
    versePage += `book: ${JSON.stringify(verse.book)}\n`;
    versePage += `chapterId: ${verse.chapterId}\n`;
    versePage += `verseId: ${verse.verseId}\n`;
    versePage += `id: ${verse.id}\n`;
    versePage += `---\n\n`;

    // Verse navigation
    let prevVerse = verseIndex > 0 ? verses[verseIndex - 1] : null;
    let nextVerse =
      verseIndex !== verses.length ? verses[verseIndex + 1] : null;

    // is there a previous chapter?
    if (!prevVerse && chapterIndex > 0) {
      let prevChapter = chapters[chapterIndex - 1];
      prevVerse = prevChapter ? prevChapter[prevChapter.length - 1] : null;
    }
    // is there a next chapter?
    if (!nextVerse && chapterIndex !== chapters.length) {
      let nextChapter = chapters[chapterIndex + 1];
      nextVerse = nextChapter ? nextChapter[0] : null;
    }

    // only include a column if the verse exists
    versePage += `| ${prevVerse ? "Previous | " : ""}Book | ${
      nextVerse ? "Next | " : ""
    }\n`;
    versePage += `| ${prevVerse ? "---: | " : ""}:---: | ${
      nextVerse ? ":--- | " : ""
    }\n`;
    versePage += `| ${
      prevVerse
        ? `[[${getFileName(prevVerse)}\\|← ${prevVerse.book.name} ${
            prevVerse.chapterId
          } ${prevVerse.verseId}]] | `
        : ""
    }[[${verse.book.name}#Chapter ${verse.chapterId}\\|${verse.book.name}]] | ${
      nextVerse
        ? `[[${getFileName(nextVerse)}\\|${nextVerse.book.name} ${
            nextVerse.chapterId
          } ${nextVerse.verseId} →]] |`
        : ""
    }\n`;

    // Verse content
    versePage += `# ${fileNameSpaces}\n`;
    versePage += `${verse.verse}\n\n`;
    versePage += `# Thoughts\n`;

    writeFile(`/Bible/${verse.book.name}/` + fileName, versePage);

    // add verse to book
    bookPage += `\n[$^{${verse.verseId}}$](${fileName}) ${verse.verse}\n`;
  });
  bookPage += "\n";
});

writeFile("/Bible/Genesis.md", bookPage);
