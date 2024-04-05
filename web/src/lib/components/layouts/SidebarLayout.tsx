import styled from "@emotion/styled";
import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  sidebar?: React.ReactNode;
}>;

const SidebarLayoutContainer = styled.div`
  display: flex;
  .content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
`;

const SidebarLayout: React.FC<Props> = ({
  children,
  className,
  sidebar,
}) => {
  return (
    <SidebarLayoutContainer className={className}>
      <div className="sidebar">{sidebar}</div>
      <div className="content">
        {children}
      </div>
    </SidebarLayoutContainer>
  );
};

export default SidebarLayout;
