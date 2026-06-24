export function getImageProxyUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return url;
  }

  const ext = url.match(/\.(png|jpg|jpeg|gif|webp|bmp|svg|avif)/i)?.[1] || "jpg";
  const encoded = encodeURIComponent(url);
  return `/image-proxy/image.${ext}?url=${encoded}`;
}
