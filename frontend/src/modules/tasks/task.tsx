import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import { cn } from '~/lib/utils.ts';
import { Card, CardContent } from '~/modules/ui/card';

import { type Edge, attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { DropTargetRecord, ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { motion } from 'framer-motion';
import { dispatchCustomEvent } from '~/lib/custom-events';
import { getDraggableItemData, isTaskData } from '~/lib/drag-and-drop';
import { DropIndicator } from '~/modules/common/drop-indicator';
import { type DropDownToRemove, dropdownerState } from '~/modules/common/dropdowner/state';
import TaskDescription from '~/modules/tasks/task-content.tsx';
import { TaskHeader } from '~/modules/tasks/task-header';
import { TaskFooter } from '~/modules/tasks/task.footer';
import type { Mode } from '~/store/theme.ts';
import type { Task } from '~/types';
import type { TaskStatus } from './task-selectors/select-status';

const variants = cva('task-card', {
  variants: {
    dragging: {
      over: 'ring-2 opacity-30',
      overlay: 'ring-2 ring-primary',
    },
    status: {
      0: 'to-sky-500/10 border-b-sky-500/20',
      1: '',
      2: 'to-slate-500/10 border-b-slate-500/20',
      3: 'to-lime-500/10 border-b-lime-500/20',
      4: 'to-yellow-500/10 border-b-yellow-500/20',
      5: 'to-orange-500/10 border-b-orange-500/20',
      6: 'to-green-500/10 border-b-green-500/20',
    },
  },
});

interface TaskProps {
  task: Task;
  mode: Mode;
  isExpanded: boolean;
  isEditing: boolean;
  isSelected: boolean;
  isFocused: boolean;
  tasks?: Task[];
  isSheet?: boolean;
  style?: React.CSSProperties;
}

export function TaskCard({ style, task, tasks, mode, isSelected, isFocused, isEditing, isExpanded, isSheet }: TaskProps) {
  const taskRef = useRef<HTMLDivElement>(null);
  const taskDragRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const dragEnd = () => {
    setClosestEdge(null);
    setDragOver(false);
  };

  const isDragOver = ({ self, source }: { source: ElementDragPayload; self: DropTargetRecord }) => {
    setDragOver(true);
    if (!isTaskData(source.data) || !isTaskData(self.data)) return;
    setClosestEdge(extractClosestEdge(self.data));
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    if (isExpanded && isFocused) return;
    dispatchCustomEvent('taskCardClick', { taskId: task.id, clickTarget: target });
  };

  useEffect(() => {
    const unsubscribe = dropdownerState.subscribe((dropdowner) => {
      if (dropdowner.id === `status-${task.id}`) setIsStatusDropdownOpen(!(dropdowner as DropDownToRemove).remove);
    });
    return () => unsubscribe();
  }, [dropdownerState]);

  // create draggable & dropTarget elements and auto scroll
  useEffect(() => {
    const element = taskRef.current;
    const dragElement = taskDragRef.current;
    const data = getDraggableItemData<Task>(task, task.order, 'task', 'project');
    if (!element || !dragElement) return;

    return combine(
      draggable({
        element,
        dragHandle: dragElement,
        getInitialData: () => data,
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      dropTargetForExternal({
        element,
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          const data = source.data;
          return isTaskData(data) && data.item.id !== task.id && data.item.status === task.status && data.type === 'task';
        },
        getIsSticky: () => true,
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter: ({ self, source }) => isDragOver({ self, source }),
        onDrag: ({ self, source }) => isDragOver({ self, source }),
        onDragLeave: () => dragEnd(),
        onDrop: () => dragEnd(),
      }),
    );
  }, [task]);

  return (
    <motion.div layout transition={{ duration: 0.3 }}>
      <Card
        id={task.id}
        onClick={handleCardClick}
        style={style}
        tabIndex={0}
        ref={taskRef}
        className={cn(
          `group/task relative rounded-none border-0 border-b bg-transparent hover:bg-card/20 bg-gradient-to-br from-transparent focus:outline-none 
        focus-visible:none border-l-2 via-transparent via-60% to-100% opacity-${dragging ? '30' : '100'} 
        ${dragOver ? 'bg-card/20' : ''} 
        ${isFocused && !isSheet ? 'border-l-primary is-focused' : 'border-l-transparent'}
        ${isExpanded ? 'is-expanded' : 'is-collapsed'}`,
          variants({
            status: task.status as TaskStatus,
          }),
        )}
      >
        <CardContent id={`${task.id}-content`} ref={taskDragRef} className="pl-1.5 pt-1 pb-2 sm: pr-1 pr-2 space-between flex flex-col relative">
          {/* To prevent on expand animation */}
          <motion.div className="flex flex-col gap-1" layout transition={{ duration: 0 }}>
            {isExpanded && !isSheet && (
              <TaskHeader
                task={task}
                isEditing={isEditing}
                changeEditingState={(state) => dispatchCustomEvent('toggleTaskEditing', { id: task.id, state })}
                closeExpand={() => dispatchCustomEvent('toggleCard', task.id)}
              />
            )}
            <TaskDescription mode={mode} task={task} isExpanded={isExpanded} isEditing={isEditing} />
            <TaskFooter task={task} tasks={tasks} isSheet={isSheet} isSelected={isSelected} isStatusDropdownOpen={isStatusDropdownOpen} />
          </motion.div>
        </CardContent>
        {closestEdge && <DropIndicator className="h-0.5" edge={closestEdge} gap={0.2} />}
      </Card>
    </motion.div>
  );
}
