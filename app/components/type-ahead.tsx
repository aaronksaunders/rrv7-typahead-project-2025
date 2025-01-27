// app/components/type-ahead.tsx
import { useFetcher } from "react-router";
import { useEffect, useState, useRef } from "react";
import type { loader, Suggestion } from "~/routes/api-suggestions";

/**
 * Props for the TypeAhead component
 */
interface TypeAheadProps {
  /** Callback function called when a suggestion is selected */
  onSelect?: (value: Suggestion) => void;
}

/**
 * A typeahead/autocomplete component that provides suggestions as the user types.
 * Uses React Router's loader for data fetching and DaisyUI for styling.
 *
 * @example
 * ```tsx
 * <TypeAhead onSelect={(suggestion) => console.log(suggestion)} />
 * ```
 */
export function TypeAhead({ onSelect }: TypeAheadProps) {
  const fetcher = useFetcher<Suggestion[]>();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Debounces API calls to prevent excessive requests while typing
   * Waits 300ms after the last keystroke before making a request
   */
  useEffect(() => {
    if (!query.trim()) {
      fetcher.data = undefined;
      return;
    }

    const timeout = setTimeout(() => {
      fetcher.load(`/api/suggestions?q=${encodeURIComponent(query)}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  /**
   * Reset selected index when suggestions change
   */
  useEffect(() => {
    setSelectedIndex(-1);
  }, [fetcher.data]);

  /**
   * Handles the selection of a suggestion
   * Updates the input value and calls the onSelect callback
   *
   * @param suggestion - The selected suggestion object
   */
  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.value);
    setIsFocused(false);
    setSelectedIndex(-1);
    onSelect?.(suggestion);
  };

  /**
   * Handles keyboard navigation within the suggestions list
   * Supports:
   * - Enter: Selects the highlighted suggestion
   * - ArrowUp: Moves highlight up
   * - ArrowDown: Moves highlight down
   * - Escape: Closes the suggestions
   *
   * @param event - The keyboard event
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Don't process keyboard navigation if there's no query or no suggestions
    if (!query.trim() || !fetcher.data?.length) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < fetcher.data!.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        // Selects either the highlighted suggestion or the
        // first one if nothing is highlighted
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(fetcher.data[selectedIndex]);
        } else if (fetcher.data.length > 0) {
          handleSelect(fetcher.data[0]);
        }
        inputRef.current?.blur();
        break;
      case "Escape":
        // Close the suggestions dropdown
        event.preventDefault();
        setIsFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="form-control w-full max-w-xl p-8">
      <div className="text-2xl font-bold mb-4">
        Type Ahead Example Using React Router v7
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder="Search fruits..."
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isFocused && !!query.trim() && !!fetcher.data?.length}
        className="input input-bordered w-full"
      />

      {isFocused && query.trim() && fetcher.data?.length && (
        <div className="dropdown-content z-10 w-full mt-1 bg-base-100 rounded-lg shadow-lg">
          {fetcher.state === "loading" ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <ul className="menu menu-vertical">
              {fetcher.data.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <a className={selectedIndex === index ? "active" : ""}>
                    {suggestion.value}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
