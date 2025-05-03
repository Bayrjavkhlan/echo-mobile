import React, { useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ModalProps,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Input } from "./Input";
import { Button } from "./Button";
import { OuterThemedView } from "../OuterThemedView";
import ThemedIcon from "../ThemedIcon";
import { Colors } from "react-native/Libraries/NewAppScreen";
import tw from "twrnc";

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
          <TouchableOpacity
            style={tw`absolute top-0 right-[-1] rounded-full px-2 py-1`}
            onPress={handleClose}
          >
            <ThemedIcon name="close" size={24} color={colorRed} />
          </TouchableOpacity>
          <ThemedText className="text-center text-2xl mb-2">{title}</ThemedText>
          <ThemedView className="flex-1 flex w-full rounded-xl justify-center">
            {children}
          </ThemedView>
          <ThemedView
            className="flex flex-row justify-between items-center"
            customBackgroundColor={backgroundColor}
          >
            <ThemedView
              className="flex flex-row gap-2"
              customBackgroundColor={backgroundColor}
            >
              {deleteButtonText && (
                <Button
                  title={deleteButtonText}
                  onPress={handleDelete}
                  buttonClass={`bg-[${colorRed}]`}
                  size="small"
                />
              )}
              <Button
                title={okeyButtonText}
                onPress={handleOk}
                buttonClass={`bg-[${titleColor}] flex-1`}
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
