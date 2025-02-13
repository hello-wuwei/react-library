import { Menu, type MenuProps } from 'antd';

const MenuIndex = (props: MenuProps) => {
  return (
    <Menu
      mode="inline"
      inlineIndent={16}
      {...props}
    />
  );
};

export default MenuIndex;
