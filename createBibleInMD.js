import fs from "fs";
// /v1/verse/1001001/relations?translation=NIV look into this later

// 66 books in the bible GEN - REV
async function getData() {
  let bible = [];
  //https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n/28079480
  const bookIds = [...Array(20).keys()].map((foo) => foo + 1);

  await Promise.all(
    bookIds.map(async (bookId) => {
      let chapters = [];

      for (let i = 1; i <= (await getNumChapters(bookId)); i += 1) {
        const obj = await getChapter(bookId, i);

        chapters[obj[0].chapterId - 1] = obj;
      }

      bible[bookId - 1] = chapters;
      console.log(`Found ${chapters[0][0].book.name} data...`);
    })
  );
  return bible;
}

// Helper funcs :)

async function getNumChapters(bookId) {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books/${bookId}/chapters?translation=NIV`
  );
  const obj = await response.json();

  return obj.length;
}

async function getChapter(bookId, chapter) {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books/${bookId}/chapters/${chapter}?translation=NIV`
  );
  const obj = await response.json();

  if (!obj.length || obj.length === 0) return false;

  return obj;
}

async function getBooks() {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books?translation=NIV`
  );
  const obj = await response.json();

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
const bookData = await getBooks();
if (bible && bookData) {
  console.log("Aquired Bible Data!");
}

function getFileName(verse) {
  return `${verse.book.name}_${verse.chapterId}_${verse.verseId}.md`;
}

// To get the website link to YouVersion bible
function getYouVersionId(verse) {
  let abvBook = "";
  switch (verse.book.name) {
    case "Genesis":
      abvBook = "GEN";
      break;
    case "Exodus":
      abvBook = "EXO";
      break;
    case "Leviticus":
      abvBook = "LEV";
      break;
    case "Numbers":
      abvBook = "NUM";
      break;
    case "Deuteronomy":
      abvBook = "DEU";
      break;
    case "Joshua":
      abvBook = "JOS";
      break;
    case "Judges":
      abvBook = "JDG";
      break;
    case "Ruth":
      abvBook = "RUT";
      break;
    case "1 Samuel":
      abvBook = "1SA";
      break;
    case "2 Samuel":
      abvBook = "2SA";
      break;
    case "1 Kings":
      abvBook = "1KI";
      break;
    case "2 Kings":
      abvBook = "2KI";
      break;
    case "1 Chronicles":
      abvBook = "1CH";
      break;
    case "2 Chronicles":
      abvBook = "2CH";
      break;
    case "Ezra":
      abvBook = "EZR";
      break;
    case "Nehemiah":
      abvBook = "NEH";
      break;
    case "Esther":
      abvBook = "EST";
      break;
    case "Job":
      abvBook = "JOB";
      break;
    case "Psalms":
      abvBook = "PSA";
      break;
    case "Proverbs":
      abvBook = "PRO";
      break;
    case "Ecclesiastes":
      abvBook = "ECC";
      break;
    case "Song of Solomon":
      abvBook = "SNG";
      break;
    case "Isaiah":
      abvBook = "ISA";
      break;
    case "Jeremiah":
      abvBook = "JER";
      break;
    case "Lamentations":
      abvBook = "LAM";
      break;
    case "Ezekiel":
      abvBook = "EZK";
      break;
    case "Daniel":
      abvBook = "DAN";
      break;
    case "Hosea":
      abvBook = "HOS";
      break;
    case "Joel":
      abvBook = "JOL";
      break;
    case "Amos":
      abvBook = "AMO";
      break;
    case "Obadiah":
      abvBook = "OBA"; // only 1 chapter
      break;
    case "Jonah":
      abvBook = "JON";
      break;
    case "Micah":
      abvBook = "MIC";
      break;
    case "Nahum":
      abvBook = "NAM";
      break;
    case "Habakkuk":
      abvBook = "HAB";
      break;
    case "Zephaniah":
      abvBook = "ZEP";
      break;
    case "Haggai":
      abvBook = "HAG";
      break;
    case "Zechariah":
      abvBook = "ZEC";
      break;
    case "Malachi":
      abvBook = "MAL";
      break;
    case "Matthew":
      abvBook = "MAT";
      break;
    case "Mark":
      abvBook = "MRK";
      break;
    case "Luke":
      abvBook = "LUK";
      break;
    case "John":
      abvBook = "JHN";
      break;
    case "Acts":
      abvBook = "ACT";
      break;
    case "Romans":
      abvBook = "ROM";
      break;
    case "1 Corinthians":
      abvBook = "1CO";
      break;
    case "2 Corinthians":
      abvBook = "2CO";
      break;
    case "Galatians":
      abvBook = "GAL";
      break;
    case "Ephesians":
      abvBook = "EPH";
      break;
    case "Philippians":
      abvBook = "PHP";
      break;
    case "Colossians":
      abvBook = "COL";
      break;
    case "1 Thessalonians":
      abvBook = "1TH";
      break;
    case "2 Thessalonians":
      abvBook = "2TH";
      break;
    case "1 Timothy":
      abvBook = "1TI";
      break;
    case "2 Timothy":
      abvBook = "2TI";
      break;
    case "Titus":
      abvBook = "TIT";
      break;
    case "Philemon":
      abvBook = "PHM"; // also 1 chapter
      break;
    case "Hebrews":
      abvBook = "HEB";
      break;
    case "James":
      abvBook = "JAS";
      break;
    case "1 Peter":
      abvBook = "1PE";
      break;
    case "2 Peter":
      abvBook = "2PE";
      break;
    case "1 John":
      abvBook = "1JN";
      break;
    case "2 John":
      abvBook = "2JN"; // 1 chapter here
      break;
    case "3 John":
      abvBook = "3JN"; // and here
      break;
    case "Jude":
      abvBook = "JUD"; // oh here too
      break;
    case "Revelation":
      abvBook = "REV";
      break;
  }
  return `${abvBook}.${verse.chapterId}`;
}

// Construct Bible Table of Contents
makeFolder("/Bible");
let genre = bookData[0].genre.name;
let bibleTOC = `# ${genre}\n`;
bookData.forEach((book, bookIndex, books) => {
  if (genre !== book.genre.name) {
    genre = book.genre.name;
    bibleTOC += `\n# ${genre}\n`;
  }
  bibleTOC += `- [[${book.name}]]\n`;
});
writeFile("/Bible/Bible 📖.md", bibleTOC);
console.log("Completed Bible TOC!");

// Construct Book Pages and Verse Pages
bible.forEach((book, bookIndex, books) => {
  let bookPage = "";
  book.forEach((chapter, chapterIndex, chapters) => {
    makeFolder(`/Bible/${book[0][0].book.name}`);

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

      // is there a previous book?
      if (!prevVerse && bookIndex > 0) {
        let prevBook = books[bookIndex - 1];
        prevVerse = prevBook
          ? prevBook[prevBook.length - 1][
              prevBook[prevBook.length - 1].length - 1
            ]
          : null;
      }
      // is there a next book?
      if (!nextVerse && bookIndex !== books.length) {
        let nextBook = books[bookIndex + 1];
        nextVerse = nextBook ? nextBook[0][0] : null;
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
      }[[${verse.book.name}#Chapter ${verse.chapterId}\\|${
        verse.book.name
      }]] | ${
        nextVerse
          ? `[[${getFileName(nextVerse)}\\|${nextVerse.book.name} ${
              nextVerse.chapterId
            } ${nextVerse.verseId} →]] |`
          : ""
      }\n`;

      // Verse content
      versePage += `# [${fileNameSpaces}](https://my.bible.com/bible/111/${getYouVersionId(
        verse
      )}.NIV)\n`;
      versePage += `${verse.verse}\n\n`;
      versePage += `# Thoughts\n`;

      writeFile(`/Bible/${verse.book.name}/` + fileName, versePage);

      // add verse to book
      bookPage += `\n[$^{${verse.verseId}}$](${fileName}) ${verse.verse}\n`;
    });

    bookPage += "\n";
  });

  writeFile(`/Bible/${book[0][0].book.name}.md`, bookPage);
  console.log(`Completed ${book[0][0].book.name}!`);
});

console.log(`\n\nDone :)\n`);
