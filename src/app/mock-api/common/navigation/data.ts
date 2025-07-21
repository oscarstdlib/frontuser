/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

const data: FuseNavigationItem[] = [
  {
    id: 'inicio',
    title: 'Inicio',
    type: 'basic',
    icon: 'mat_outline:dashboard',
    link: '/example'
  },
  {
    id: 'clientes',
    title: 'Usuarios',
    type: 'basic',
    icon: 'mat_outline:group_add',
    link: '/user'
  },

];

export const defaultNavigation: FuseNavigationItem[] = data;
export const compactNavigation: FuseNavigationItem[] = data;
export const futuristicNavigation: FuseNavigationItem[] = data;
export const horizontalNavigation: FuseNavigationItem[] = data;
