import { PageMode, PagePermissions, MODE_PERMISSIONS } from '@/types/pageMode';

export const usePagePermissions = (mode: PageMode): PagePermissions => {
  return MODE_PERMISSIONS[mode];
};