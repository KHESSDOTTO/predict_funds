import { ax } from "@/database/axios.config";

let cachedAncoras: string[] = [];
let lastSuccessfullyFetchedTime: number = 0;
const CACHE_DURATION: number = 6 * 60 * 60 * 1000; // Cache duration - time limit to revalidate cache

export default async function getCachedAncoras() {
  const currentTime = Date.now();
  const noAncoras = !cachedAncoras;
  const cacheExpired =
    currentTime > lastSuccessfullyFetchedTime + CACHE_DURATION;
  const shouldRevalidateCache = noAncoras || cacheExpired;

  if (shouldRevalidateCache) {
    const response = await ax.get("/prediction/getAncoras");
    const newAncoras = response.data;

    if (newAncoras) {
      lastSuccessfullyFetchedTime = currentTime;
      cachedAncoras = newAncoras;
    }
  }

  return cachedAncoras;
}
