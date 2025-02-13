import { Layout, type MenuProps } from 'antd';
import { classes } from './styles';
import { type FC } from 'react';
import Menu from './Menu';
import cn from 'classnames';

const Sider = Layout.Sider;

export type SiderBarProps = {
  collapsed?: boolean;
  name?: string;
  className?: string;
  menuProps: MenuProps;
};

/**
 * @param collapsed --受控折叠状态（默认false）
 * @param name --侧边栏系统名称
 * @param menuProps --antd菜单属性（MenuProps）
 * @param className --扩展样式
 * @param onCollapseClick --点击折叠按钮事件
 */
const SiderBar: FC<SiderBarProps> = ({
  collapsed = false,
  name,
  menuProps,
  className,
  ...props
}) => {
  return (
    <Sider
      className={cn(classes.container, className)}
      trigger={null}
      collapsed={collapsed}
      theme="dark"
      {...props}
    >
      <div className={classes.header}>
        <span className="system-name">{!collapsed ? name : null}</span>
      </div>
      <Menu
        theme="dark"
        {...menuProps}
      />
    </Sider>
  );
};

export default SiderBar;
