import { useEffect, useRef } from "react";

interface IProps {
  open: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Modal: React.FC<IProps> = (props) => {
  const {
    open, onClose,
    style,
    children
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (ref.current && open) {
      ref.current.addEventListener('click', (evt: MouseEvent) => {

        if (evt.target === ref.current) {
          onClose();
        };
      })
    }

  }, [open, onClose])

  return (
    <>
      <div ref={ref} className={`modal${open ? ' active' : ''}`}>
        <div className="modal-block" style={style}>
          {children}          
        </div>
      </div>
    </>
  )
}