import { ExtendedField } from "models/types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { FieldsService } from "services/Fields.service";
import Flag from "react-world-flags";
import FieldArea from "components/field-area/FieldArea";
import geojsonArea from "@mapbox/geojson-area";
import { GeometryObject } from "geojson";

const FieldDetail = () => {
  const { fieldId } = useParams();

  const [fieldDetail, setFieldDetail] = useState({} as ExtendedField);
  const [fieldArea, setFieldArea] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  /**
   * calculate the total area based on geometry object.
   * @param geometry
   * @returns the total area calculated in m2
   */
  const calcArea = (geometry: GeometryObject): number => {
    if (!geometry) {
      return 0;
    }

    try {
      return geojsonArea.geometry(geometry);
    } catch (error) {
      return 0;
    }
  };

  // get field information from the backend and calculate the total field area
  useEffect(() => {
    const fetchFieldDetail = async () => {
      try {
        if (!fieldId) {
          throw new Error("fieldId is missing!");
        }

        // request the field area from the backend. if the fieldId is not provided use a fallback and
        const fieldDetailData = await FieldsService.findFieldById(fieldId);

        setFieldDetail(fieldDetailData);

        // calculating the area based on geometry data
        const area = calcArea(fieldDetailData.geoData.geometry);

        // convert from m2 to ac
        setFieldArea(area * 0.000247105);
      } catch (error: any) {
        setError(
          `Ops, something was wrong. Error message: ${
            error.response?.data?.message || "Unidentified error"
          }`
        );
      } finally {
        setIsLoaded(true);
      }
    };
    fetchFieldDetail();
  }, [fieldId]);

  if (error) {
    return <h1>{error}</h1>;
  }

  return isLoaded ? (
    <Container>
      <Row>
        <h1>Field Detail</h1>
      </Row>
      <Row>
        <Col>Name</Col>
        <Col>{fieldDetail.name}</Col>
      </Row>
      <Row>
        <Col>Country:</Col>
        <Col>
          <Flag code={fieldDetail.countryCode} height="24" />
        </Col>
      </Row>
      <Row>
        <Col>Owner</Col>
        <Col>{fieldDetail.owner}</Col>
      </Row>
      <Row>
        <Col>Type</Col>
        <Col>{fieldDetail.type}</Col>
      </Row>
      <Row>
        <Col>Area</Col>
        <Col>
          {fieldArea && <FieldArea area={fieldArea} defaultUnit="ac" />}
        </Col>
      </Row>
    </Container>
  ) : (
    <h1>Loading</h1>
  );
};
export default FieldDetail;
