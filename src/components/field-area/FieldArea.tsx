import React, { useCallback, useEffect, useState } from "react";

type Props = {
  area: number; // the current area value
  defaultUnit: Units; // the unit of area parameter
};

type Units = "ac" | "ha";

const FieldArea = ({ area, defaultUnit }: Props) => {
  const [fieldArea, setFieldArea] = useState(area);
  const [selectedUnit, setSelectedUnit] = useState<Units>(defaultUnit);

  // convert an area from current unit to desired unit
  const convertArea = useCallback((area: number, to: Units): number => {
    const factor = 0.4046856422;

    if (to === "ac") {
      return area / factor;
    }

    if (to === "ha") {
      return area * factor;
    }

    return 0;
  }, []);

  // when the user change the area unit
  const onChangeAreaUnit = (e: any) => {
    setSelectedUnit(e.target.value);
    setFieldArea((currentFieldArea) =>
      convertArea(currentFieldArea, e.target.value)
    );
  };

  return (
    <>
      <span>{[fieldArea.toFixed(2), " ", selectedUnit]}</span>
      <div>
        <input
          type="radio"
          id="ha"
          value="ha"
          name="areaType"
          checked={selectedUnit === "ha"}
          onChange={onChangeAreaUnit}
        />
        <label htmlFor="ha">ha</label>
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
