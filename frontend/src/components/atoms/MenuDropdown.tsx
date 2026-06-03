import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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
      <MenuButton className="data-active:bg-blue-200">
        {props.button}
      </MenuButton>
      <MenuItems anchor="bottom">
        {links.map((link) => (
          <MenuItem key={link.label}>
            <a
              className="block"
              href={link.href}
              onClick={() => link.click?.()}
            >
              {link.label}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </>
  );
}

export default MenuDropdown;
