import React, { memo } from "react";
import { Table } from "reactstrap";
import { BasicField } from "models/types";
import { Link } from "react-router-dom";

type Props = {
  fields: BasicField[]; // fields data
  sortOrderText: string; // information about the order (asc or desc) that fields are sorted
  sortBy: string; // by wich field the data is sorted
  onSortFields: Function; // executed when user click in the column header to sort field data
};

const TableData = ({ fields, sortOrderText, sortBy, onSortFields }: Props) => {
  return (
    <Table hover>
      <thead>
        <tr>
          <th data-testid="fieldHeaderId" onClick={() => onSortFields("id")}>
            Id {sortBy === "id" && `(${sortOrderText})`}
          </th>
          <th data-testid="fieldHeaderName" onClick={() => onSortFields("name")}>
            Name {sortBy === "name" && `(${sortOrderText})`}
          </th>
          <th data-testid="fieldHeaderType" onClick={() => onSortFields("type")}>
            Type {sortBy === "type" && `(${sortOrderText})`}
          </th>
        </tr>
      </thead>
      <tbody>
        {fields?.length > 0 ? (
          fields.map((field: BasicField) => (
            <tr key={field.id} data-testid="fieldRow">
              <th scope="row">
                <Link id={field.id} to={`/field/${field.id}`}>
                  {field.id}
                </Link>
              </th>
              <td>{field.name}</td>
              <th>
                <img
                  src={require(`assets/images/${field.type || "no-image"}.png`)}
                  width={24}
                  height={24}
                  alt={field.type}
                ></img>
              </th>
            </tr>
          ))
        ) : (
          <tr>
            <th colSpan={3}>No fields found</th>
          </tr>
        )}
        <tr>
          <th colSpan={2}>Total</th>
          <th data-testid="fieldsTotal">{fields.length}</th>
        </tr>
      </tbody>
    </Table>
  );
};

export default memo(TableData);
