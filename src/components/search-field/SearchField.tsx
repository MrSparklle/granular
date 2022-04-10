import { FieldType } from "models/types";
import React, { useState } from "react";
import { Container, FormGroup, Input, Label } from "reactstrap";

type Props = {
  fieldTypes: FieldType[];
  onSearch: Function;
};

const SearchField = ({ fieldTypes, onSearch }: Props) => {
  console.log("search render");

  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");

  const onSearchHandler = (e: any) => {
    setFieldName(e.target.value);
    onSearch(e.target.value.trim(), fieldType);
  };

  const onSelectTypeHandler = (e: any) => {
    setFieldType(e.target.value);
    onSearch(fieldName, e.target.value.trim());
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
