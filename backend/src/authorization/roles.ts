export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
}

export const canCreateRole = (actor: UserRole, target: UserRole): boolean =>
  actor === UserRole.SUPERADMIN && target === UserRole.ADMIN;

export const canManageParents = (actor: UserRole): boolean =>
  actor === UserRole.SUPERADMIN || actor === UserRole.ADMIN;

export const canManageChildren = (actor: UserRole, ownsChild: boolean): boolean =>
  actor === UserRole.PARENT && ownsChild;
