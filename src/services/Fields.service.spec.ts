import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { ExtendedField } from "models/types";
import { FieldResult, FieldsService } from "./Fields.service";

class NoErrorThrownError extends Error {}

// Auxilary function to prevent calling expect conditionally when test for errors
const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    // call the function passed as parameter
    await call();

    // if the call don't raise an error, something was wrong, so return a diferente error to test it
    throw new NoErrorThrownError();
  } catch (error: unknown) {
    // return the error object promisse
    return error as TError;
  }
};

describe("Fields Service Tests", () => {
  it("should return all fields data successfully", async () => {
    const res = {
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

    jest.spyOn(axios, "get").mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: res,
        headers: { "content-type": "application/json" },
      })
    );

    const result = await FieldsService.findAllFields();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toBeCalledWith("/fields");
    expect(result).toEqual(res);
    expect(result).toBeInstanceOf(Object);
  });

  it("should return a specific field byId data successfully", async () => {
    const res = {
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

    jest.spyOn(axios, "get").mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: res,
        headers: { "content-type": "application/json" },
      })
    );

    const result = await FieldsService.findFieldById(
      "6bc2f998-e7f2-4c36-82d3-6b6dc92bc7f4"
    );

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      "/fields/6bc2f998-e7f2-4c36-82d3-6b6dc92bc7f4"
    );
    expect(result).toEqual(res);
    expect(result).toBeInstanceOf(Object);
  });

  it("should thrown an error when provide a invalid fieldId", async () => {
    jest.spyOn(axios, "get").mockImplementation(() =>
      Promise.reject({
        status: 404,
        error: {
          response: {
            data: {
              message: "no data found",
            },
          },
        },
        headers: { "content-type": "application/json" },
      })
    );

    const error = await getError(async () => FieldsService.findFieldById(""));

    // check that the returned error wasn't that no error was thrown
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty("status", 404);
    expect(error).toHaveProperty(
      "error.response.data.message",
      "no data found"
    );
  });
});
