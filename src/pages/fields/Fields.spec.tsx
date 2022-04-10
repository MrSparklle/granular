import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "App";
import { ExtendedField } from "models/types";
import { MemoryRouter } from "react-router-dom";
import { FieldResult, FieldsService } from "services/Fields.service";
import Fields from "./Fields";

const fieldsMock = {
  fields: [
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
  ],
} as FieldResult;

const fieldDetailMock = {
  countryCode: "IO",
  name: "Drekampbell",
  owner: "Harold Kreisman",
  type: "corporate",
  geoData: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-108.61083984375, 43.909765943908],
          [-108.7481689453125, 43.50075243569041],
          [-107.8692626953125, 43.03677585761058],
          [-107.26501464843749, 43.476840397778936],
          [-107.31994628906249, 43.94537239244209],
          [-108.61083984375, 43.909765943908],
        ],
      ],
    },
  },
  id: "6bc2f998-e7f2-4c36-82d3-6b6dc92bc7f4",
} as ExtendedField;

beforeEach(() => {
  jest
    .spyOn(FieldsService, "findAllFields")
    .mockImplementation(() => Promise.resolve(fieldsMock));

  jest
    .spyOn(FieldsService, "findFieldById")
    .mockImplementation(() => Promise.resolve(fieldDetailMock));
});

describe("Fields Page Tests", () => {
  it("should return the field list", async () => {
    render(
      <MemoryRouter>
        <Fields />
      </MemoryRouter>
    );
    expect(FieldsService.findAllFields).toHaveBeenCalled();
    expect(await screen.findByText("Drekampbell")).toBeInTheDocument();
    expect(await screen.findByText("Twinklekennedy")).toBeInTheDocument();
  });

  it("should search for a field", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const searchInput = await screen.findByPlaceholderText("search names");
    fireEvent.change(searchInput, { target: { value: "Drekampbell" } });

    expect(await screen.findByText("Drekampbell")).toBeInTheDocument();
    // when check for non existing elements use queryBy to not thrown an error.
    expect(screen.queryByText("Twinklekennedy")).not.toBeInTheDocument();
  });

  it("should filter by field type", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const fielTypeSelect = await screen.findByTestId("fielTypeSelect");
    fireEvent.change(fielTypeSelect, { target: { value: "collective" } });

    expect(await screen.findByText("Twinklekennedy")).toBeInTheDocument();
    expect(screen.queryByText("Drekampbell")).not.toBeInTheDocument();
  });

  it("should navigate to field detail", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.click(
      await screen.findByText("6bc2f998-e7f2-4c36-82d3-6b6dc92bc7f4")
    );

    expect(await screen.findByText("Harold Kreisman")).toBeInTheDocument();
  });

  it("should sort all fields by type asc and desc", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const rowsDefault = await screen.findAllByTestId("fieldRow");

    // default order
    expect(
      within(rowsDefault[0]).getByText("Twinklekennedy")
    ).toBeInTheDocument();
    expect(within(rowsDefault[1]).getByText("Drekampbell")).toBeInTheDocument();

    // order asc
    const headerName = await screen.findByText("Name");
    fireEvent.click(headerName);

    const rowsAsc = await screen.findAllByTestId("fieldRow");

    expect(within(rowsAsc[0]).getByText("Drekampbell")).toBeInTheDocument();
    expect(within(rowsAsc[1]).getByText("Twinklekennedy")).toBeInTheDocument();

    // order desc
    fireEvent.click(headerName);

    const rowsDesc = await screen.findAllByTestId("fieldRow");

    expect(within(rowsDesc[0]).getByText("Twinklekennedy")).toBeInTheDocument();
    expect(within(rowsDesc[1]).getByText("Drekampbell")).toBeInTheDocument();
  });
});