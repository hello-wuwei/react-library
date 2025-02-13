import { useState, type FC } from 'react';
import { Layout } from 'antd';
import SiderBar, { type SiderBarProps } from '../SiderBar';
import HeaderBar, { type HeaderBarProps } from '../HeaderBar';
import { classes } from './styles';
import cn from 'classnames';

const Content = Layout.Content;

export type LayoutContainerProps = {
  collapsible?: boolean;
  siderBarProps: SiderBarProps;
  headerBarProps: HeaderBarProps;
  hideSidebar?: boolean;
  className?: string;
  onCollapseChange?(collapsed: boolean): void;
};

/**
 * @param collapsible --是否可折叠侧边栏
 * @param siderBarProps --侧边栏属性（和SiderBarProps一致）
 * @param headerBarProps --侧边栏属性（和HeaderBarProps一致）
 * @param className --额外样式名
 * @param hideSidebar --隐藏SiderBar
 * @param onCollapseChange --折叠状态变化回调
 */
const LayoutContainer: FC<LayoutContainerProps> = ({
  children,
  collapsible = false,
  siderBarProps,
  headerBarProps,
  hideSidebar = false,
  onCollapseChange,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapseClick = () => {
    setCollapsed(!collapsed);
    onCollapseChange?.(!collapsed);
  };

  return (
    <Layout className={cn(classes.container, className)}>
      {!hideSidebar && (
        <SiderBar
          collapsed={collapsed}
          {...siderBarProps}
        />
      )}
      <Layout>
        <HeaderBar
          hideCollapseIcon={!collapsible}
          onCollapseClick={onCollapseClick}
          collapsed={collapsed}
          {...headerBarProps}
        />
        <Content className="frame-content-container">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
