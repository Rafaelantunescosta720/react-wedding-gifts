
export async function fetchGifts() {

  try {
      const response = await fetch("http://localhost:3000/api/get-gifts");
    if (!response.ok) {
      throw new Error("Failed to fetch gifts");
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching gifts:", error);
  }
}
