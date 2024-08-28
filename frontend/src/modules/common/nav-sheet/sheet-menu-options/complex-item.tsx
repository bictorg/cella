import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { useEffect, useRef, useState } from 'react';
import { getDraggableItemData } from '~/lib/utils';
import type { UserMenuItem } from '~/types';
import { DropIndicator } from '../../drop-indicator';
import { isPageData } from '../helpers';
import { MenuArchiveToggle } from '../menu-archive-toggle';
import { SheetMenuItemsOptions } from './index';
import { ItemOption } from './item-option';

const { draggable, dropTargetForElements } = await import('@atlaskit/pragmatic-drag-and-drop/element/adapter');
const { attachClosestEdge, extractClosestEdge } = await import('@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge');
const { combine } = await import('@atlaskit/pragmatic-drag-and-drop/combine');

interface ComplexOptionElementProps {
  item: UserMenuItem;
  shownOption: 'archived' | 'unarchive';
  hideSubmenu: boolean;
  isSubmenuArchivedVisible?: boolean;
  toggleSubmenuVisibility: (id: string) => void;
}
export const ComplexOptionElement = ({
  item,
  shownOption,
  isSubmenuArchivedVisible = false,
  hideSubmenu,
  toggleSubmenuVisibility,
}: ComplexOptionElementProps) => {
  const dragRef = useRef(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const handleCanDrop = (sourceData: Record<string | symbol, unknown>) => {
    return (
      isPageData(sourceData) && sourceData.item.id !== item.id && sourceData.itemType === item.entity && sourceData.item.parentId === item.parentId
    );
  };

  // create draggable & dropTarget elements and auto scroll
  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;
    const data = getDraggableItemData(item, item.membership.order, 'menuItem', item.entity);
    return combine(
      draggable({
        element,
        dragHandle: element,
        getInitialData: () => data,
      }),
      dropTargetForElements({
        element,
        // allow drop if both have sum menu or both have not
        canDrop: ({ source }) => handleCanDrop(source.data),
        getIsSticky: () => true,
        getData: ({ input }) =>
          attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          }),
        onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
        onDrop: () => setClosestEdge(null),
        onDragLeave: () => setClosestEdge(null),
      }),
    );
  }, [item]);

  return (
    <div className="relative my-1">
      <div ref={dragRef}>
        <ItemOption item={item} itemType={item.entity} parentItemSlug={item.parentSlug} />
        {!item.membership.archived && item.submenu && !!item.submenu.length && !hideSubmenu && (
          <>
            <SheetMenuItemsOptions data={item.submenu} shownOption={shownOption} />
            <MenuArchiveToggle
              archiveToggleClick={() => toggleSubmenuVisibility(item.id)}
              inactiveCount={item.submenu.filter((i) => i.membership.archived).length}
              isArchivedVisible={isSubmenuArchivedVisible}
              isSubmenu
            />
            {isSubmenuArchivedVisible && <SheetMenuItemsOptions data={item.submenu} shownOption="archived" />}
          </>
        )}
      </div>
      {closestEdge && <DropIndicator className="h-0.5 w-full" edge={closestEdge} gap={0.35} />}
    </div>
  );
};
