export function getPrimaryImageUrl(profile: {
  imageUrls?: string[]
}): string | undefined {
  const url = profile.imageUrls?.find((item) => item.trim().length > 0)
  return url?.trim() || undefined
}

export function getProfileImageUrls(profile: {
  imageUrls?: string[]
}): string[] {
  return (profile.imageUrls ?? []).filter((url) => url.trim().length > 0)
}
