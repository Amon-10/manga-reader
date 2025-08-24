export const getCoverUrl = (manga) => {
    const fileName = manga.md_covers?.[0]?.b2key;
    return fileName ? `https://meo.comick.pictures/${fileName}` : null;
  };