import React from "react";
import Select from "react-select";

const MultiSelect = ({ options, name, onChange, value }) => {
  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    onChange(selectedIds);
  };

  // Convertir opciones a formato requerido por react-select
  const selectOptions = options.map((option) => ({
    value: option.id, // Assuming each genre has an 'id' property
    label: option.nombre,
  }));

  // Obtener opciones seleccionadas para mostrar
  const selectedValues = selectOptions.filter((option) =>
    value.includes(option.value)
  );

  return (
    <Select
      isMulti
      options={selectOptions}
      value={selectedValues}
      onChange={handleSelectChange}
    />
  );
};

export default MultiSelect;