import React, { useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ModalProps,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Button } from "./Button";
import ThemedIcon from "../ThemedIcon";

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

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  return (
    <Modal
      ref={modalRef}
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      {...modalProps}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.overlay}>
          <ThemedView
            style={[
              styles.modalContainer,
              { maxHeight: windowHeight * 0.85, width: windowWidth * 0.9 },
            ]}
            customBackgroundColor={backgroundColor}
            inheritTheme={false}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <ThemedIcon name="close" size={24} color={colorRed} />
            </TouchableOpacity>

            <ThemedText style={styles.title}>{title}</ThemedText>

            <ScrollView
              style={styles.contentScrollView}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

            <ThemedView
              style={styles.buttonContainer}
              customBackgroundColor={backgroundColor}
            >
              <ThemedView
                style={styles.buttonRow}
                customBackgroundColor={backgroundColor}
              >
                {deleteButtonText && (
                  <Button
                    title={deleteButtonText}
                    onPress={handleDelete}
                    buttonClass={`bg-[${colorRed}]`}
                  />
                )}
                <Button
                  title={okeyButtonText}
                  onPress={handleOk}
                  buttonClass={`bg-[${titleColor}] flex-1`}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 5,
    paddingTop: 5,
  },
  contentScrollView: {
    maxHeight: Platform.OS === "ios" ? "75%" : "80%",
  },
  contentContainer: {
    paddingBottom: 10,
  },
  buttonContainer: {
    paddingTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
});

export default CustomModal;
