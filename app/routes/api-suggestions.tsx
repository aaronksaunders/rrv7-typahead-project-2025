// app/routes/api.suggestions.tsx
import type { Route } from "./+types/api-suggestions";

/**
 * Represents a suggestion item in the typeahead component
 * @interface Suggestion
 * @property {string} id - Unique identifier for the suggestion (lowercase)
 * @property {string} value - Display text for the suggestion
 */
export interface Suggestion {
  id: string;
  value: string;
}

/**
 * Mock database of fruits
 * Each fruit has a lowercase ID and a properly capitalized display value
 * Limited to 20 common and exotic fruits for demonstration
 * @type {Suggestion[]}
 */
const fruits: Suggestion[] = [
  { id: "apple", value: "Apple" },
  { id: "banana", value: "Banana" },
  { id: "blackberry", value: "Blackberry" },
  { id: "blueberry", value: "Blueberry" },
  { id: "dragonfruit", value: "Dragonfruit" },
  { id: "grapefruit", value: "Grapefruit" },
  { id: "kiwi", value: "Kiwi" },
  { id: "lemon", value: "Lemon" },
  { id: "lime", value: "Lime" },
  { id: "lychee", value: "Lychee" },
  { id: "mango", value: "Mango" },
  { id: "nectarine", value: "Nectarine" },
  { id: "orange", value: "Orange" },
  { id: "papaya", value: "Papaya" },
  { id: "passionfruit", value: "Passionfruit" },
  { id: "peach", value: "Peach" },
  { id: "pineapple", value: "Pineapple" },
  { id: "raspberry", value: "Raspberry" },
  { id: "strawberry", value: "Strawberry" },
  { id: "watermelon", value: "Watermelon" },
];

/**
 * Route loader function that handles typeahead suggestions
 * Returns filtered suggestions based on the search query
 *
 * @param {Route.LoaderArgs} params - Route loader arguments containing the request
 * @returns {Promise<Suggestion[]>} Array of matching suggestions (max 10 items)
 *
 * @example
 * // Request: GET /api/suggestions?q=ap
 * // Response: [
 * //   { id: "apple", value: "Apple" },
 * //   { id: "papaya", value: "Papaya" }
 * // ]
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().toLowerCase() || "";

  // Validate query and return empty array if no query is provided
  if (!query) return new Response("[]", { status: 200 });

  // Simulate DB query, limit response to 10 items
  const suggestions = fruits
    .filter((fruit) => fruit.value.toLowerCase().includes(query))
    .slice(0, 10);

  return Response.json(suggestions, {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
