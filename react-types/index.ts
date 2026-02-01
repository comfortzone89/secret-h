import { ReactElement, MouseEventHandler } from "react";

interface MenuItemBase {
  label: string;
  icon: ReactElement;
  subMenu?: MenuItem[];
  alwaysShow?: boolean;
}

interface MenuLinkItem extends MenuItemBase {
  link: string;
  onClick?: never;
}

interface MenuActionItem extends MenuItemBase {
  link?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

interface MenuContainerItem extends MenuItemBase {
  link?: never;
  onClick?: never;
  subMenu: MenuItem[];
}

export type MenuItem = MenuLinkItem | MenuActionItem | MenuContainerItem;
