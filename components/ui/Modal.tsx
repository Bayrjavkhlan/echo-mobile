import React, { useRef } from "react";
import { Modal, View, StyleSheet, ModalProps } from "react-native";
import { ThemedView } from "../ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Input } from "./Input";
import { Button } from "./Button";
import { OuterThemedView } from "../OuterThemedView";

interface CustomModalProps extends ModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  okeyButtonText?: string;
  onOk?: () => void;
  cancelButtonText?: string;
  onCancel?: () => void;
  deleteButtonText?: string;
  onDelete?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  visible,
  onClose,
  children,
  okeyButtonText = "Хадгалах",
  onOk,
  cancelButtonText = "Буцах",
  onCancel,
  deleteButtonText,
  onDelete,
  ...modalProps
}) => {
  const modalRef = useRef<Modal>(null);

  const backgroundColor = useColor("modalBackground");
  const colorRed = useColor("red");
  const titleColor = useColor("title");

  const handleClose = () => onClose?.();

  const handleOk = () => {
    onOk?.();
    handleClose();
  };

  const handleDelete = () => {
    onDelete?.();
    handleClose();
  };
  console.log("colorRed", colorRed);
  console.log("titleColor", titleColor);

  return (
    <Modal
      ref={modalRef}
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      {...modalProps}
    >
      <View style={styles.overlay}>
        <ThemedView
          className={`w-[85%] p-5 rounded-xl shadow-xl h-[180px]`}
          customBackgroundColor={backgroundColor}
          inheritTheme={false}
        >
          <ThemedText className="text-center text-2xl mb-2">{title}</ThemedText>
          <ThemedView className="flex-1 flex w-full rounded-xl justify-center">
            {children}
          </ThemedView>
          <ThemedView
            className="flex flex-row justify-between items-center"
            customBackgroundColor={backgroundColor}
          >
            <View className="flex-1">
              {deleteButtonText && (
                <Button
                  title={deleteButtonText}
                  onPress={handleDelete}
                  buttonClass={`bg-[${colorRed}]`}
                  size="small"
                />
              )}
            </View>

            <ThemedView
              className="flex flex-row gap-2"
              customBackgroundColor={backgroundColor}
            >
              <Button
                title="Буцах"
                onPress={handleClose}
                type="outlined"
                size="small"
              />

              <Button
                title="Хадгалах"
                onPress={handleOk}
                buttonClass={`bg-[${titleColor}]`}
                size="small"
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomModal;
