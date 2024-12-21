// utils/convertImageUrl.js

const extractFileId = (url) => {
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
export const convertImageUrl = (url) => {
    if (!url) return null;
  
    const fileId = extractFileId(url);
    if (!fileId) return null;
  
    return `https://lh3.googleusercontent.com/d/${fileId}`;
};
  