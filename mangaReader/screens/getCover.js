export const getCoverUrl = (manga) => {
    const fileName = manga.data[0].id;
    return fileName ? `https://api.mangadex.org/cover?limit=10&manga%5B%5D=${fileName}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc` : null;
  };