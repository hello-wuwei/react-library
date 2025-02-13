import { type ReactNode, type FC } from 'react';
import { Dropdown, Layout, Space, type MenuProps, Menu } from 'antd';
import { classes } from './styles';
import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import cn from 'classnames';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';

const Header = Layout.Header;

export type HeaderBarProps = {
  collapsed?: boolean;
  hideCollapseIcon?: boolean;
  user?: {
    name: string;
    mode?: 'overlay';
    items?: ItemType[];
    onItemClick: MenuProps['onClick'];
  };
  leftItems?: ReactNode[];
  rightItems?: ReactNode[];
  subHeader?: ReactNode;
  className?: string;
  onCollapseClick?(): void;
};

/**
 * @param collapsed --受控折叠状态（默认false）
 * @param hideCollapseIcon --是否显示折叠图标
 * @param leftItems --左侧扩展项
 * @param rightItems --右侧扩展项
 * @param subHeader --子Header（可用于显示Tab导航窗口栏或面包屑）
 * @param className --扩展样式
 * @param onCollapseClick --点击折叠按钮事件
 * @param user --用户中心配置（右上角）
 * @param user.mode --user.mode为菜单模式（注意：在antd版本低于<4.24.0时使用mode="overlay"模式，否则触发hover时可能导致页面崩溃报错）
 */
const HeaderBar: FC<HeaderBarProps> = ({
  collapsed = false,
  hideCollapseIcon = false,
  user,
  leftItems,
  rightItems,
  subHeader,
  className,
  onCollapseClick,
}) => {
  const menuCollapsedIcon = collapsed ? (
    <MenuUnfoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
  ) : (
    <MenuFoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
  );

  const getOverlay = () => {
    if (!user?.items) return;

    return (
      <Menu
        theme="light"
        items={user?.items || []}
        onClick={user?.onItemClick}
      />
    );
  };

  const isOverlay = user?.mode === 'overlay'; // 手动兼容低版本antd -> Dropdown（<4.24.0）
  const dropdownProps = isOverlay
    ? {
        overlay: getOverlay(),
      }
    : { menu: { items: user?.items || [], onClick: user?.onItemClick } };

  return (
    <Header className={cn(classes.container, 'priority', className)}>
      <div className="layout-main-header-container">
        <Space
          onClick={() => onCollapseClick?.()}
          size={16}
        >
          {!hideCollapseIcon && menuCollapsedIcon}
          {leftItems}
        </Space>
        <Space size={16}>
          {rightItems}
          {user && (
            <Dropdown
              disabled={!user?.items?.length}
              {...dropdownProps}
            >
              <div className="header-user-name">
                <UserOutlined style={{ fontSize: 14 }} />
                <span style={{ margin: '0 8px' }}>{user.name}</span>
                <DownOutlined style={{ fontSize: 12 }} />
              </div>
            </Dropdown>
          )}
        </Space>
      </div>
      <div className="layout-sub-header-container">{subHeader}</div>
    </Header>
  );
};

export default HeaderBar;
