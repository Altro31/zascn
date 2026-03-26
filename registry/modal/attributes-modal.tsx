"use client";
import IconPlus from "@/components/icon/icon-plus";
import IconTrash from "@/components/icon/icon-trash";
import SimpleModal from "@/components/modal/modal";
import showToast from "@/config/toast/toastConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const attributesSchema = z.object({
  attributes: z.array(
    z.object({
      key: z.string().min(1, "La clave es requerida"),
      value: z.string().min(1, "El valor es requerido"),
    })
  ),
});

type AttributesFormData = z.infer<typeof attributesSchema>;

interface AttributesModalProps {
  open: boolean;
  onClose: () => void;
  entityId: number;
  entityName: string;
  attributes?: Record<string, string>;
  onSave: (
    entityId: number,
    attributes: Record<string, string>
  ) => Promise<{ error?: string }>;
  onSuccess?: () => void;
}

const AttributesModal: React.FC<AttributesModalProps> = ({
  open,
  onClose,
  entityId,
  entityName,
  attributes,
  onSave,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttributesFormData>({
    resolver: zodResolver(attributesSchema),
    defaultValues: {
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  useEffect(() => {
    if (open) {
      const attributesArray = attributes
        ? Object.entries(attributes).map(([key, value]) => ({ key, value }))
        : [];
      reset({
        attributes:
          attributesArray.length > 0
            ? attributesArray
            : [{ key: "", value: "" }],
      });
    }
  }, [open, attributes, reset]);

  const onSubmit = async (data: AttributesFormData) => {
    try {
      setLoading(true);
      const attributesObject: Record<string, string> = {};
      data.attributes.forEach(attr => {
        if (attr.key.trim() && attr.value.trim()) {
          attributesObject[attr.key.trim()] = attr.value.trim();
        }
      });

      const response = await onSave(entityId, attributesObject);

      if (response.error) {
        showToast(response.error || "Error al actualizar atributos", "error");
      } else {
        showToast("Atributos actualizados correctamente", "success");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error updating attributes:", error);
      showToast("Error al actualizar atributos", "error");
    } finally {
      setLoading(false);
    }
  };

  const addNewAttribute = () => {
    append({ key: "", value: "" });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title={`Modificar Atributos - ${entityName}`}
    >
      <div className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-200">
                Atributos
              </h4>
              <button
                type="button"
                onClick={addNewAttribute}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <IconPlus className="w-3 h-3" />
                Agregar
              </button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p>
                  No hay atributos. Haz clic en Agregar para crear uno nuevo.
                </p>
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    {...control.register(`attributes.${index}.key`)}
                    placeholder="Clave"
                    className="w-full form-input"
                  />
                  {errors.attributes?.[index]?.key && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.attributes[index]?.key?.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    {...control.register(`attributes.${index}.value`)}
                    placeholder="Valor"
                    className="w-full form-input"
                  />
                  {errors.attributes?.[index]?.value && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.attributes[index]?.value?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Eliminar atributo"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

export default AttributesModal;
