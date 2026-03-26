"use client";
import SimpleModal from "./modal";
import React from "react";

interface ProcessingModalProps {
  open: boolean;
  title?: string;
  message?: string;
  // No close action mientras procesa; opcional permitir cancelar en el futuro
  allowClose?: boolean;
  onClose?: () => void;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  open,
  title = "Procesando",
  message = "Por favor espera...",
  allowClose = false,
  onClose = () => {},
}) => {
  return (
    <SimpleModal
      open={open}
      onClose={allowClose ? onClose : () => {}}
      title={title}
      className="max-w-sm"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          {message}
        </p>
      </div>
    </SimpleModal>
  );
};

export default ProcessingModal;
