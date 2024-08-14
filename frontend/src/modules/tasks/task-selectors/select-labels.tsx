import { CommandEmpty } from 'cmdk';
import { Check, Dot, History, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { nanoid, recentlyUsed } from '~/lib/utils.ts';
import { useWorkspaceUIStore } from '~/store/workspace-ui.ts';
import { useWorkspaceStore } from '~/store/workspace.ts';
import { Kbd } from '~/modules/common/kbd.tsx';
import { Badge } from '~/modules/ui/badge.tsx';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading } from '~/modules/ui/command.tsx';
import { inNumbersArray } from './helpers.ts';
import type { Label } from '~/types/index.ts';
import { createLabel, updateLabel, type CreateLabelParams } from '~/api/labels.ts';
import { updateTask } from '~/api/tasks.ts';
import { dispatchCustomEvent } from '~/lib/custom-events.ts';
import { useLocation } from '@tanstack/react-router';

export const badgeStyle = (color?: string | null) => {
  if (!color) return {};
  return { background: color };
};

interface SetLabelsProps {
  value: Label[];
  organizationId: string;
  projectId: string;
  triggerWidth?: number;
  creationValueChange?: (labels: Label[]) => void;
}

const SetLabels = ({ value, projectId, organizationId, creationValueChange, triggerWidth = 280 }: SetLabelsProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { changeColumn } = useWorkspaceUIStore();
  const { focusedTaskId, workspace, labels } = useWorkspaceStore();

  const [selectedLabels, setSelectedLabels] = useState<Label[]>(value);
  const [searchValue, setSearchValue] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);

  const [orderedLabels] = useState(
    labels.filter((l) => l.projectId === projectId).sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()),
  );

  const isSearching = searchValue.length > 0;

  const showedLabels = useMemo(() => {
    if (searchValue.length) return orderedLabels.filter((l) => l.name.toLowerCase().includes(searchValue));
    if (isRemoving) return selectedLabels;
    // save to recent labels all labels that used in past 3 days
    changeColumn(workspace.id, projectId, {
      recentLabels: orderedLabels.filter((l) => recentlyUsed(l.lastUsed, 3)),
    });
    return orderedLabels.slice(0, 8);
  }, [isRemoving, searchValue]);

  const updateTaskLabels = async (labels: Label[]) => {
    if (!focusedTaskId) return;
    const labelIds = labels.map((l) => l.id);
    const updatedTask = await updateTask(focusedTaskId, 'labels', labelIds);
    if (pathname.includes('/board')) dispatchCustomEvent('taskCRUD', { array: [updatedTask], action: 'update' });
    dispatchCustomEvent('taskTableCRUD', { array: [updatedTask], action: 'update' });
    return;
  };

  const handleSelectClick = async (value?: string) => {
    if (!value) return;
    setSearchValue('');
    const existingLabel = selectedLabels.find((label) => label.name === value);
    if (existingLabel) {
      const updatedLabels = selectedLabels.filter((label) => label.name !== value);
      setSelectedLabels(updatedLabels);
      if (creationValueChange) return creationValueChange(updatedLabels);
      await updateTaskLabels(updatedLabels);
      await updateLabel(existingLabel.id, existingLabel.useCount + 1);
      return;
    }
    const newLabel = labels.find((label) => label.name === value);
    if (newLabel) {
      const updatedLabels = [...selectedLabels, newLabel];
      setSelectedLabels(updatedLabels);
      if (creationValueChange) return creationValueChange(updatedLabels);
      await updateLabel(newLabel.id, newLabel.useCount + 1);
      await updateTaskLabels(updatedLabels);
      return;
    }
  };

  const handleCreateClick = async (value: string) => {
    setSearchValue('');
    if (labels.find((l) => l.name === value)) return handleSelectClick(value);

    const newLabel: CreateLabelParams = {
      id: nanoid(),
      name: value,
      color: '#FFA9BA',
      organizationId: organizationId,
      projectId: projectId,
    };

    await createLabel(newLabel);
    const updatedLabels = [...selectedLabels, newLabel];
    setSelectedLabels(updatedLabels);
    updateTaskLabels(updatedLabels);
  };

  useEffect(() => {
    setSelectedLabels(value);
  }, [value]);

  return (
    <Command className="relative rounded-lg max-h-[40vh] overflow-y-auto" style={{ width: `${triggerWidth}px` }}>
      <CommandInput
        autoFocus={true}
        value={searchValue}
        onValueChange={(searchValue) => {
          // If the label types a number, select the label like useHotkeys
          if (inNumbersArray(6, searchValue)) return handleSelectClick(labels[Number.parseInt(searchValue) - 1]?.name);
          setSearchValue(searchValue.toLowerCase());
        }}
        clearValue={setSearchValue}
        className="leading-normal"
        placeholder={showedLabels.length ? t('common:placeholder.search_labels') : t('common:create_label.text')}
      />
      {!isSearching && <Kbd value="L" className="max-sm:hidden absolute top-3 right-2.5" />}
      <CommandList>
        <CommandGroup>
          {!labels && (
            <CommandLoading>
              <Loader2 className="text-muted-foreground h-6 w-6 mx-auto mt-2 animate-spin" />
            </CommandLoading>
          )}
          {labels.length === 0 && (
            <CommandEmpty className="text-muted-foreground text-sm flex items-center justify-center px-3 py-2">
              {t('common:no_resource_yet', { resource: t('common:labels').toLowerCase() })}
            </CommandEmpty>
          )}
          {showedLabels.map((label, index) => (
            <CommandItem
              key={label.id}
              value={label.name}
              onSelect={(value) => {
                handleSelectClick(value);
              }}
              className="group rounded-md flex justify-between items-center w-full leading-normal"
            >
              <div className="flex items-center gap-2">
                {isSearching || isRemoving ? (
                  <Dot className="rounded-md" size={16} style={badgeStyle(label.color)} strokeWidth={8} />
                ) : (
                  <History size={16} />
                )}
                <span>{label.name}</span>
              </div>
              <div className="flex items-center">
                {selectedLabels.some((l) => l.id === label.id) && <Check size={16} className="text-success" />}
                {!isSearching && <span className="max-sm:hidden text-xs opacity-50 ml-3 mr-1">{index + 1}</span>}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        {!isSearching && selectedLabels.length ? (
          <CommandItem className="flex justify-center text-sm m-1" onSelect={() => setIsRemoving(!isRemoving)}>
            {isRemoving ? 'Show recent labels' : 'Show selected labels'}
          </CommandItem>
        ) : (
          <CommandItemCreate onSelect={() => handleCreateClick(searchValue)} searchValue={searchValue} labels={labels} />
        )}
      </CommandList>
    </Command>
  );
};

export default SetLabels;

interface CommandItemCreateProps {
  searchValue: string;
  labels: Label[];
  onSelect: () => void;
}

const CommandItemCreate = ({ searchValue, labels, onSelect }: CommandItemCreateProps) => {
  const { t } = useTranslation();
  const hasNoLabel = !labels.map(({ name }) => name.toLowerCase()).includes(searchValue.trim());
  const render = searchValue.trim() !== '' && hasNoLabel;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem className="text-sm m-1 flex justify-center items-center" onSelect={onSelect}>
      {t('common:create_resource', { resource: t('common:label').toLowerCase() })}
      <Badge className="ml-2 px-2 py-0 font-light flex" variant="plain">
        {searchValue}
      </Badge>
    </CommandItem>
  );
};
