import type { SheetProp } from '~/modules/common/sheeter/sheet';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '~/modules/ui/drawer';

export default function MobileSheet({ sheet, removeSheet }: SheetProp) {
  const { modal = true, side = 'right', description, title, className, content } = sheet;

  return (
    <Drawer modal={modal} open={true} onClose={removeSheet} direction={side} noBodyStyles>
      <DrawerContent onEscapeKeyDown={removeSheet} direction={side} className={className}>
        <DrawerHeader className={`${description || title ? '' : 'hidden'}`}>
          <DrawerTitle className={`font-medium mb-2 ${title ? '' : 'hidden'}`}>{title}</DrawerTitle>
          <DrawerDescription className={`text-muted-foreground font-light pb-4${description ? '' : 'hidden'}`}>{description}</DrawerDescription>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
}
