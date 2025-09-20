export const getCoverUrl = async (manga) => {
    try{
      const mangaID = manga.id;
      
      const mangaCoverRes =  await fetch (`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${mangaID}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`);
      const mangaCoverJson = await mangaCoverRes.json();
      
      const coverFileName = mangaCoverJson?.data[0]?.attributes?.fileName;
      
      return mangaID && coverFileName ? `https://uploads.mangadex.org/covers/${mangaID}/${coverFileName}` : null;
    } catch(error) {
      console.error("Error fetching manga cover", error);
      return null;
    }
  };
