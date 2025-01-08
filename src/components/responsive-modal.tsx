"use client";

import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ResponsiveModal({
  children,
  isOpen,
  setIsOpen,
}: ResponsiveModalProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scroll-bar max-h-[85vh]">
          <DialogTitle className="hidden"></DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerTitle className="hidden"></DrawerTitle>
        <div className="overflow-y-auto hide-scroll-bar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
