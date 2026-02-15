import { useState, useRef, useEffect, useCallback } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./style.module.css";

type ModalProps = {
  isOpen: boolean;
  toggleModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
  draggable?: boolean;
  title?: string;
  className?: string;
};

/*
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  closeOnOutsideClick={false}
  draggable={true}
  title="Minha Modal"
>
  <div>Seu conteúdo aqui</div>
</Modal>
*/

export default function Modal({
  isOpen,
  toggleModal,
  children,
  closeOnOutsideClick = false,
  draggable = true,
  title = "",
  className = "",
}: ModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const { offsetWidth, offsetHeight } = modalRef.current;
          setPosition({
            x: (window.innerWidth - offsetWidth) / 2,
            y: (window.innerHeight - offsetHeight) / 2,
          });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => toggleModal(false), [toggleModal]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggable) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = window.innerWidth - (modalRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (modalRef.current?.offsetHeight || 0);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging, dragStart, draggable],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={modalRef}
      className={`${styles.modal} ${draggable ? styles.draggable : ""} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
        style={{ cursor: draggable ? "grab" : "default" }}
      >
        {title && <h3 className={styles.title}>{title}</h3>}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );

  return closeOnOutsideClick ? (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleModal(false);
      }}
    >
      {modalContent}
    </div>
  ) : (
    modalContent
  );
}
