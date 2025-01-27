import type { Route } from "./+types/home";
import { TypeAhead } from "../components/type-ahead";
import { useState } from "react";
import type { Suggestion } from "./api-suggestions";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

/**
 * Home component that displays a typeahead component and logs the selected
 * suggestion
 *
 * @returns {JSX.Element} - The Home component
 */
export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");

  /**
   * Handles the selection of a suggestion
   * Updates the selected value and logs the selected suggestion
   *
   * @param {Suggestion} value - The selected suggestion object
   */
  const handleSelect = (value: Suggestion) => {
    console.log("selectedValue", value);
    setSelectedValue(value.value);
  };
  return (
    <div className="p-8" style={{ backgroundColor: "#f0f0f0" }}>
      <TypeAhead onSelect={handleSelect} />
      <div className="text-2xl font-bold mt-8">Selected: {selectedValue}</div>
    </div>
  );
}
