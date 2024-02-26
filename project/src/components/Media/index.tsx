import { useState } from "react";
import { FileType } from "../../common/types"
import { Modal } from "../Modal";
import { SERVER_URI } from "../../common/constant";

interface IProps {
  file?: FileType;
}

export const Media: React.FC<IProps> = (props) => {
  const { file } = props;
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleDownloadFile = () => {
    
    if (!file) return;

    const filename = file.filepath.split('/').pop();
    const uri = `${SERVER_URI}:8000/api/utils/download/file/text/${filename}`;

    fetch(uri)

    const link = document.createElement('a');
    link.href = uri;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      {file ? (
        <div className="comment-attach">
          {file.filepath.includes('images') ? (
            <>
              <img
                className="prerend"
                src={`http://localhost:8000/api/utils/get/file${file.filepath}`}
                alt=""
                onClick={() => setOpen(true)}
              />
            
              <Modal
                open={isOpen}
                onClose={() => setOpen(false)}
              >
                  <img
                    src={`http://localhost:8000/api/utils/get/file${file.filepath}`}
                    alt=""
                  />
              </Modal>
            </>
          ) : (
            <>
              <button onClick={handleDownloadFile}>
                {file.filename}
              </button>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}