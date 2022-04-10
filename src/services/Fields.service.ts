import axios from "axios";
import { BasicField, ExtendedField } from "models/types";

export type FieldResult = {
  fields: BasicField[];
};

export const FieldsService = {
  findAllFields: async (): Promise<FieldResult> => {
    const fieldsData = await axios.get<FieldResult>("/fields");
    return fieldsData.data;
  },

  findFieldById: async (id: string): Promise<ExtendedField> => {
    const fieldDetail = await axios.get<ExtendedField>(`/fields/${id}`);
    return fieldDetail.data;
  },
};
