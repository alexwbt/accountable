import styled from "@emotion/styled";
import CommonProps from "../CommonProps";

type Props = CommonProps<{
  header?: React.ReactNode;
}>;

const SidebarLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
`;

const HeaderLayout: React.FC<Props> = ({
  children,
  className,
  header,
}) => {
  return (
    <SidebarLayoutContainer className={className}>
      <div className="header">{header}</div>
      <div className="content">
        {children}
      </div>
    </SidebarLayoutContainer>
  );
};

export default HeaderLayout;
