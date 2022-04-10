import SearchField from "components/search-field/SearchField";
import TableData from "components/table-data/TableData";
import { BasicField, FieldType } from "models/types";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "reactstrap";
import { FieldsService } from "services/Fields.service";

const Fields = () => {
  // all fields data
  const [fields, setFields] = useState([] as BasicField[]);
  // distinct fieldTypes from all fields data
  const [fieldTypes, setFieldTypes] = useState([] as FieldType[]);

  // fields table is unsorted (0), sorted asscending (-1), sorted descending (1);
  const [sortOrder, setSortOrder] = useState(0);
  const [sortBy, setSortBy] = useState("");

  // control the page loading state
  const [isLoaded, setIsLoaded] = useState(false);
  // keep the error state while loading data
  const [error, setError] = useState("");

  // this ref maintain the original field data regardless all the filters and sorts, used to restore original data when needed
  const fieldsDataRef = useRef([] as BasicField[]);

  useEffect(() => {
    async function fetchHome() {
      try {
        const fieldsData = await FieldsService.findAllFields();
        setFields(fieldsData.fields);

        fieldsDataRef.current = [...fieldsData.fields];

        // create a unique values of fields type used to filter
        const typesData = fieldsData.fields.reduce(
          (acc, cur) => acc.add(cur.type),
          new Set<FieldType>()
        );
        setFieldTypes([...typesData]);
      } catch (error: any) {
        setError(
          `Ops, something was wrong. Error message: ${
            error.response?.data?.message || "Unidentified error"
          }`
        );
      } finally {
        setIsLoaded(true);
      }
    }
    fetchHome();
  }, []);

  // when user search for some fieldname or filter for field type
  const onSearchHandler = (term: string, type: string) => {
    // check if there any search term or filter
    if (term || type) {
      // use the original ref array to search, filter and order the result
      setFields(
        fieldsDataRef.current
          .filter((field) => {
            // if search term is provided, search for it
            const searchFound = term
              ? field.name
                  .toLocaleLowerCase()
                  .includes(term.toLocaleLowerCase())
              : false;

            // if filter type is provided, filter by it
            const selectFound = type ? field.type === type : true;

            return (
              (term && searchFound && selectFound) || (!term && selectFound)
            );
          })
          .sort((a: any, b: any) =>
            a[sortBy] < b[sortBy] ? sortOrder : sortOrder * -1
          )
      );
    } else {
      // if no search term or filter, restore original data with actual sort order
      setFields(
        [...fieldsDataRef.current].sort((a: any, b: any) =>
          a[sortBy] < b[sortBy] ? sortOrder : sortOrder * -1
        )
      );
    }
  };

  const onSortFields = (sortBy: string) => {
    // if the data is not filtered yet sortOrder = 0, else, invert sort order
    const newSortOrder = !sortOrder ? -1 : sortOrder * -1;

    setFields((currentFields) => [
      ...currentFields.sort((a: any, b: any) => {
        return a[sortBy] < b[sortBy] ? newSortOrder : newSortOrder * -1;
      }),
    ]);
    setSortOrder(newSortOrder);
    setSortBy(sortBy);
  };

  if (error) {
    return <h1>{error}</h1>;
  }

  return isLoaded ? (
    <Container fluid="lg">
      <SearchField
        fieldTypes={fieldTypes}
        onSearch={(term: string, type: string) => onSearchHandler(term, type)}
      />
      <TableData
        fields={fields}
        sortOrderText={sortOrder === -1 ? "asc" : sortOrder === 1 ? "desc" : ""}
        sortBy={sortBy}
        onSortFields={(sortBy: string) => onSortFields(sortBy)}
      />
    </Container>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Fields;
