import { UserRole, canCreateRole, canManageChildren, canManageParents } from './roles';

describe('KidsLearn role policy', () => {
  it('allows only superadmin to create admins', () => {
    expect(canCreateRole(UserRole.SUPERADMIN, UserRole.ADMIN)).toBe(true);
    expect(canCreateRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(false);
    expect(canCreateRole(UserRole.SUPERADMIN, UserRole.PARENT)).toBe(false);
  });

  it('allows admins to manage parents', () => {
    expect(canManageParents(UserRole.SUPERADMIN)).toBe(true);
    expect(canManageParents(UserRole.ADMIN)).toBe(true);
    expect(canManageParents(UserRole.PARENT)).toBe(false);
  });

  it('limits child management to the owning parent', () => {
    expect(canManageChildren(UserRole.PARENT, true)).toBe(true);
    expect(canManageChildren(UserRole.PARENT, false)).toBe(false);
    expect(canManageChildren(UserRole.ADMIN, true)).toBe(false);
  });
});
