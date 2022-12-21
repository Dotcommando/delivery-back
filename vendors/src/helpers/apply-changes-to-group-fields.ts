import { Types } from 'mongoose';

import { IMembership } from '../common/types';
import { UpdateGroupsBodyDto } from '../dto';


export function applyChangesToGroupFields(
  groups: IMembership<Types.ObjectId>[],
  changes: UpdateGroupsBodyDto,
): IMembership<Types.ObjectId>[] {
  let groupsWithIdAsString: IMembership<string>[] = groups.map((group: IMembership<Types.ObjectId>) => ({
    role: group.role,
    group: String(group.group),
  }));

  if ('add' in changes && changes.add?.length) {
    groupsWithIdAsString = groupsWithIdAsString.concat(
      changes.add
        .map((groupToAdd) => ({
          role: groupToAdd.role,
          group: String(groupToAdd.group),
        })),
    );
  }

  if ('update' in changes && changes.update?.length) {
    for (const update of changes.update) {
      const groupToUpdate = groupsWithIdAsString
        .find((group: IMembership<string>) => group.group === String(update.group));

      if (!groupToUpdate) {
        continue;
      }

      groupToUpdate.role = update.role;
    }
  }

  if ('delete' in changes && changes.delete?.length) {
    const groupsToDelete = changes.delete.map((groupId) => String(groupId));

    for (const groupIdToDelete of groupsToDelete) {
      const index = groupsWithIdAsString.findIndex((group: IMembership<string>) => group.group === groupIdToDelete);

      if (index > -1) {
        groupsWithIdAsString.splice(index, 1);
      }
    }
  }

  return groupsWithIdAsString.map((group: IMembership<string>) => ({
    group: new Types.ObjectId(group.group),
    role: group.role,
  }));
}
