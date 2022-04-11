import React, { useCallback, useEffect, useState } from "react";

type Props = {
  area: number; // the current area value
  defaultUnit: Units; // the unit of area parameter
};

type Units = "ac" | "m2";

const FieldArea = ({ area, defaultUnit }: Props) => {
  const [fieldArea, setFieldArea] = useState(area);
  const [selectedUnit, setSelectedUnit] = useState<Units>(defaultUnit);

  // convert an area from current unit to desired unit
  const convertArea = useCallback((area: number, to: Units): number => {
    const factor = 0.0001;

    if (to === "ac") {
      return area * factor;
    }

    if (to === "m2") {
      return area / factor;
    }

    return 0;
  }, []);

  // when the user change the area unit
  const onChangeAreaUnit = (e: any) => {
    setSelectedUnit(e.target.value);
  };

  // when user change area unit, this effect is executed to convert the field area to unit provided
  useEffect(() => {
    setFieldArea((currentFieldArea) =>
      convertArea(currentFieldArea, selectedUnit)
    );
  }, [convertArea, selectedUnit]);

  return (
    <>
      <span>{[fieldArea.toFixed(2), " ", selectedUnit]}</span>
      <div>
        <input
          type="radio"
          id="m2"
          value="m2"
          name="areaType"
          checked={selectedUnit === "m2"}
          onChange={onChangeAreaUnit}
        />
        <label htmlFor="m2">m2</label>
        <input
          type="radio"
          id="ac"
          value="ac"
          name="areaType"
          checked={selectedUnit === "ac"}
          onChange={onChangeAreaUnit}
        />
        <label htmlFor="ac">ac</label>
      </div>
    </>
  );
};

export default FieldArea;
