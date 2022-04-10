import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { BasicField } from "models/types";
import { MemoryRouter } from "react-router-dom";
import TableData from "./TableData";

describe("Table Data Component Tests", () => {
  const mockOnSortFields = jest.fn();

  const fieldsData = [
    {
      id: "baeef7cb-1fe2-4f16-8b8f-f51ed40170a3",
      name: "Twinklekennedy",
      type: "collective",
    },
    {
      id: "6bc2f998-e7f2-4c36-82d3-6b6dc92bc7f4",
      name: "Drekampbell",
      type: "corporate",
    },
  ] as BasicField[];

  it("should show the table with the fields data", async () => {
    render(
      <MemoryRouter>
        <TableData
          fields={fieldsData}
          sortOrderText=""
          sortBy=""
          onSortFields={(sortBy: string) => mockOnSortFields(sortBy)}
        />
      </MemoryRouter>
    );

    expect(await screen.findByText("Drekampbell")).toBeInTheDocument();
    expect(await screen.findByText("Twinklekennedy")).toBeInTheDocument();
  });

  it("should show the total fields", async () => {
    render(
      <MemoryRouter>
        <TableData
          fields={fieldsData}
          sortOrderText=""
          sortBy=""
          onSortFields={(sortBy: string) => mockOnSortFields(sortBy)}
        />
      </MemoryRouter>
    );

    const fieldsTotal = await screen.findByTestId("fieldsTotal");

    expect(fieldsTotal.textContent).toEqual(fieldsData.length.toString());
  });

  it("should show asc in header column by field sorted by", async () => {
    render(
      <MemoryRouter>
        <TableData
          fields={fieldsData}
          sortOrderText="asc"
          sortBy="name"
          onSortFields={(sortBy: string) => mockOnSortFields(sortBy)}
        />
      </MemoryRouter>
    );

    const fieldHeaderName = await screen.findByTestId("fieldHeaderName");

    expect(fieldHeaderName.textContent).toContain('asc');
  });

  it("should show message 'No fields found' when the list is empty", async () => {
    render(
      <MemoryRouter>
        <TableData
          fields={[]}
          sortOrderText=""
          sortBy=""
          onSortFields={(sortBy: string) => mockOnSortFields(sortBy)}
        />
      </MemoryRouter>
    );

    expect(await screen.findByText("No fields found")).toBeInTheDocument();
  });
});
