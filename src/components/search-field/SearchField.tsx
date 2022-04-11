import { FieldType } from "models/types";
import React, { useState } from "react";
import { Container, FormGroup, Input, Label } from "reactstrap";

type Props = {
  fieldTypes: FieldType[]; // arry of fields type, used to populate the select field
  onSearchFilter: Function; // when the user search or filter
};

const SearchField = ({ fieldTypes, onSearchFilter }: Props) => {
  // field name search term
  const [fieldName, setFieldName] = useState("");
  // field type search term
  const [fieldType, setFieldType] = useState("");

  // when user search for specific field name
  const onSearchHandler = (e: any) => {
    setFieldName(e.target.value);
    onSearchFilter(e.target.value.trim(), fieldType);
  };

  // when user filter for specific field type
  const onSelectTypeHandler = (e: any) => {
    setFieldType(e.target.value);
    onSearchFilter(fieldName, e.target.value.trim());
  };
  return (
    <Container>
      <FormGroup>
        <Label for="exampleSearch">Search</Label>
        <Input
          id="exampleSearch"
          name="search"
          value={fieldName}
          onChange={onSearchHandler}
          placeholder="search names"
          type="search"
        />
      </FormGroup>
      <FormGroup>
        <Label for="fielTypeSelect">Select</Label>
        <Input
          id="fielTypeSelect"
          data-testid="fielTypeSelect"
          name="fielTypeSelect"
          type="select"
          onChange={onSelectTypeHandler}
        >
          <option></option>
          {fieldTypes &&
            fieldTypes.map((field: string) => (
              <option key={field}>{field}</option>
            ))}
        </Input>
      </FormGroup>
    </Container>
  );
};

export default SearchField;
