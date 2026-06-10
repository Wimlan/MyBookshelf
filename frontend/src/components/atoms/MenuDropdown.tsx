import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";

interface Props {
  button: string;
  links: NavLink[];
}

interface NavLink {
  href?: string;
  click?: () => void;
  label: string;
}

function MenuDropdown(props: Props) {
  const { links } = props;

  return (
    <>
      <Menu>
        <MenuButton className="data-active:bg-warmred data-active:text-lightest px-2  hover:text-warmred cursor-pointer">
          {props.button}
        </MenuButton>
        <MenuItems className="bg-warmgrey p-3" anchor="bottom start">
          {links.map((link) => (
            <MenuItem key={link.label}>
              <a
                className="block pt-2 cursor-pointer"
                href={link.href}
                onClick={() => link.click?.()}
              >
                {link.label}
              </a>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </>
  );
}

export default MenuDropdown;
