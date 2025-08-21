const BASE_URL = "http://localhost:8000/api";

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // seulement si tu utilises cookies / sanctum
  });

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des catégories");
  }

  return await response.json();
}
