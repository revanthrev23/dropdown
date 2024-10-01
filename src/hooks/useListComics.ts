import { useQuery } from "@tanstack/react-query";

export const useComics = (
  url: string,
  limit: number = 10,
  offset: number = 0,
  searchTerm?: string
) => {
  const pubKey2 = "5dc53236d431a53c310bda44bf3a9549";
  return useQuery({
    queryKey: ["marvelCharacters", searchTerm, limit, offset],
    queryFn: async () => {
      const response = await fetch(
        searchTerm
          ? `${url}?apikey=${pubKey2}&limit=${limit}&offset=${offset}&titleStartsWith=${searchTerm}`
          : `${url}?apikey=${pubKey2}&limit=${limit}&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      return data.data.results.map((title: string) => title);
    },
  });
};
