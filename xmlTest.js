// /v1/verse/1001001/relations?translation=NIV look into this later

// 66 books in the bible GEN - REV
async function getData() {
  let firstVerses = [];
  const bookIds = [1, 2, 3, 4];
  await Promise.all(
    bookIds.map(async (bookID) => {
      let chapters = [];
      let chapter = 1;

      const obj = await getChapter(bookID, chapter);
            
      chapters[obj[0].chapterId - 1] = obj;
      
      firstVerses[bookID-1] = chapters;
      chapter += 1;
    })
  );
  return firstVerses;
}

getData().then((data) => console.log(data[2]));


async function getChapter(bookID, chapter) {
  const response = await fetch(
    `https://bible-go-api.rkeplin.com/v1/books/${bookID}/chapters/${chapter}?translation=NIV`
  );
  const obj = await response.json();
  
  if (!obj.length || obj.length === 0) return false;

  return obj;
}