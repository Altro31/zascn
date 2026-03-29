import { ActionIcon, Menu } from "@mantine/core";
import {
  ArrowDownToLine,
  CheckIcon,
  CircleDollarSign,
  Cog,
  Eye,
  File,
  Lock,
  MoreHorizontal,
  PencilIcon,
  Trash,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import DeleteDialog from '@/components/modal/delete-modal';

interface MenuProps {
  onAddEntity?: () => void;
  entityLabel?: string;
  onEdit?: () => void;
  onViewDetails?: () => void;
  onViewDocuments?: () => void;
  onDelete?: () => void;
  onPay?: () => void;
  onDownload?: () => void;
  onActive?: () => void;
  onActivateBusiness?: () => void; // Nueva acción específica para abrir modal de activación
  isActive?: boolean;
  onBlocked?: () => void;
  isBlocked?: boolean;
  onVerify?: () => void;
  isVerify?: boolean;
  onModifyAttributes?: () => void;
  onViewPermissions?: () => void;
}

const ActionsMenu = ({
  onAddEntity,
  entityLabel,
  onDelete,
  onEdit,
  onViewDocuments,
  onViewDetails,
  onPay,
  onActive,
  onActivateBusiness,
  isActive,
  isBlocked,
  isVerify,
  onDownload,
  onBlocked,
  onVerify,
  onModifyAttributes,
  onViewPermissions,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setLoading(true);
      try {
        await onDelete();
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
      }
    }
  };

  return (
    <>
      <Menu shadow="lg" width={200}>
        <Menu.Target>
          <ActionIcon
            className="flex items-center justify-center"
            variant="subtle"
            size="sm"
          >
            <MoreHorizontal className="h-5 w-5" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown className="space-y-2 border border-gray-200 bg-white px-1 text-textColor dark:bg-black">
          {onViewDetails && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Eye className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              Ver detalles
            </Menu.Item>
          )}

          {onDownload && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<ArrowDownToLine className="h-4 w-4" />}
              onClick={onDownload}
            >
              Descargar
            </Menu.Item>
          )}

          {onEdit && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<PencilIcon className="h-4 w-4" />}
              onClick={onEdit}
            >
              Editar
            </Menu.Item>
          )}

          {onModifyAttributes && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog className="h-4 w-4" />}
              onClick={onModifyAttributes}
            >
              Modificar Atributos
            </Menu.Item>
          )}

          {onActivateBusiness && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={onActivateBusiness}
            >
              Activar negocio
            </Menu.Item>
          )}

          {onPay && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CircleDollarSign className="h-4 w-4" />}
              onClick={onPay}
            >
              Pagar
            </Menu.Item>
          )}

          {onVerify && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={onVerify}
            >
              {isVerify ? "Quitar Verificación" : "Dar Verificación"}
            </Menu.Item>
          )}

          {onBlocked && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Lock className="h-4 w-4" />}
              onClick={onBlocked}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Menu.Item>
          )}

          {onViewDocuments && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<File className="h-4 w-4" />}
              onClick={onViewDocuments}
            >
              Ver Documentos
            </Menu.Item>
          )}
          {onViewPermissions && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Lock className="h-4 w-4" />}
              onClick={onViewPermissions}
            >
              Ver Permisos
            </Menu.Item>
          )}
          {onAddEntity && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<UserPlus className="h-4 w-4" />}
              onClick={onAddEntity}
            >
              Añadir {entityLabel || "Nueva Entidad"}
            </Menu.Item>
          )}

          {(onDelete || onVerify || onBlocked || onActive) && <Menu.Divider />}
          {onActive && (
            <Menu.Item
              className={`p-1 text-sm ${isActive ? "hover:bg-red-500" : "hover:bg-green-500"}`}
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={onActive}
            >
              {isActive ? "Desactivar" : "Activar"}
            </Menu.Item>
          )}

          {(onDelete || onVerify || onBlocked || onActive) && <Menu.Divider />}

          {onDelete && (
            <>
              <Menu.Item
                className={`p-1 text-sm hover:bg-red-500`}
                leftSection={<Trash className="h-4 w-4" />}
                onClick={() => {
                  setDeleteDialogOpen(true);
                }}
              >
                Eliminar
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      {onDelete && (
        <DeleteDialog
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          loading={loading}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
};
export default ActionsMenu;
