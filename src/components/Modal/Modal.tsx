import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import CloseIcon from "/xmark-solid.svg";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode; 
  className?: string;
}

export default function Modal({ open, setOpen, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button className="rounded-lg hover:bg-gray-200" onClick={() => setOpen(false)}>
            <img src={CloseIcon} alt="Close" className="w-4" />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
