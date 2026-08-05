const CLOUDINARY_IMAGE_UPLOAD_PATTERN = /\/image\/upload\/(?!.*(?:^|\/)c_fill,)/;

export function getCloudinaryCircleAvatarUrl(url: string): string;
export function getCloudinaryCircleAvatarUrl(
  url: null | undefined,
): null | undefined;
export function getCloudinaryCircleAvatarUrl(url: string | null | undefined) {
  if (!url?.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    CLOUDINARY_IMAGE_UPLOAD_PATTERN,
    "/image/upload/c_fill,g_face,w_240,h_240,r_max/",
  );
}
