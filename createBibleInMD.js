import fs from 'fs';
// /v1/verse/1001001/relations?translation=NIV look into this later

// 66 books in the bible GEN - REV
async function getData() {
  let bible = [];
  //https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n/28079480
  const bookIds = [...Array(1).keys()].map(foo => foo + 1);
  console.log(bookIds);

  await Promise.all(
    bookIds.map(async (bookID) => {
      let chapters = [];

      for (let i = 1; i <= await getNumChapters(bookID); i += 1) {
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

const bible = await getData();
let page = '';
bible[0].forEach(chapter => {
  page += `# Chapter ${chapter[0].chapterId}\n`;
  chapter.forEach(verse => {
    page += `$^{${verse.verseId}}$ ${verse.verse}\n`;
  });
  page+='\n'
});

fs.writeFile('Genesis.md', page, function (err) {
  if (err) throw err;
  console.log('Genesis Saved!');
}); 