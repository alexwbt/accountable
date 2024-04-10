import styled from "@emotion/styled";
import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { ReactNode, useCallback, useEffect, useState } from "react";
import useKeyListener from "../hooks/event/useKeyListener";

type ConfirmDialogProps = {
  id: number;
  index: number;
  title?: ReactNode;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

type CreateDialogOption = {
  title?: ReactNode;
  message?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const bindings: {
  removeDialog?: (id: number) => void;
  createDialog?: (option: CreateDialogOption) => number;
} = {};
let dialogId = 0;

export const useConfirmDialog = () => {
  const registerBindings = useCallback((value: typeof bindings) => {
    bindings.removeDialog = value.removeDialog;
    bindings.createDialog = value.createDialog;
  }, []);
  const removeDialog = (id: number) => bindings.removeDialog && bindings.removeDialog(id);
  const createDialog = (options: CreateDialogOption) => bindings.createDialog && bindings.createDialog(options);

  return {
    registerBindings,
    removeDialog,
    createDialog,
  };
};

const ConfirmDialogsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ConfirmDialogContainer = styled.div<{ index: number }>`
  width: 400px;
  position: absolute;
  transform: translate(-50%, -70%);
  top: calc(50% + ${props => props.index * 5}px);
  left: calc(50% + ${props => props.index * 5}px);
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
`;

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  index,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmDialogContainer index={index}>
      <Card>
        {title && <CardHeader title={title} />}
        <CardContent>{message}</CardContent>
        <CardActions>
          <Button size="small" onClick={onCancel} color="secondary">Cancel</Button>
          <Button size="small" onClick={onConfirm}>Confirm</Button>
        </CardActions>
      </Card>
    </ConfirmDialogContainer>
  );
};

const ConfirmDialogs: React.FC = () => {
  const [dialogs, setDialogs] = useState<Omit<ConfirmDialogProps, "index">[]>([]);
  const { registerBindings } = useConfirmDialog();

  const removeDialog = useCallback((id: number) => {
    setDialogs(list => list.filter(d => d.id !== id));
  }, []);

  const createDialog = useCallback((options: CreateDialogOption) => {
    const id = ++dialogId;
    setDialogs(list => [...list, {
      id,
      title: options.title,
      message: options.message || "Are you sure?",
      onConfirm: () => {
        options.onConfirm && options.onConfirm();
        removeDialog(id);
      },
      onCancel: () => {
        options.onCancel && options.onCancel();
        removeDialog(id);
      },
    }]);
    return id;
  }, [removeDialog]);

  useEffect(() => {
    registerBindings({
      removeDialog,
      createDialog,
    });
  }, [registerBindings, removeDialog, createDialog]);

  useKeyListener(["Escape"], [], () => {
    if (dialogs.length > 0)
      dialogs[dialogs.length - 1].onCancel();
  });

  return dialogs.length > 0 ? (
    <ConfirmDialogsContainer>
      {dialogs.map((dialog, i) => (
        <ConfirmDialog key={dialog.id} {...dialog} index={i} />
      ))}
    </ConfirmDialogsContainer>
  ) : <></>;
};

export default ConfirmDialogs;
