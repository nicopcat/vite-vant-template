import useUserStore from '@/store/modules/users'

export function hasBtnPermission(roles) {
  const permissions = useUserStore().getPermissions;
  if (roles && permissions) {
    return permissions.includes('*:*:*') || roles.some(role => permissions.includes(role));
  } else {
    return true;
  }
}