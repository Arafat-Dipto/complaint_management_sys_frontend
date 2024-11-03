import React, { useEffect, useState } from "react";
import UploadIcon from "../../assets/Upload.png";

export default function FileAttachmentField({
  formik,
  fieldName,
  fileAttachment,
  setMergeFile,
  mergeFile,
  setSelectedFiles,
  selectedFiles,
}) {
  const [selectedFilesName, setSelectedFilesName] = useState([]);
  const [oldFile, setOldFile] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    setSelectedFiles(files);
    setSelectedFilesName(files.map((file) => ({ name: file.name, file })));
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFilesName];
    updatedFiles.splice(index, 1);
    setSelectedFilesName(updatedFiles);
    const updatedFilesList = updatedFiles.map((file) => file.file);
    setSelectedFiles(updatedFilesList);
  };

  const removeOldFile = (index) => {
    const updatedFiles = [...oldFile];
    updatedFiles.splice(index, 1);
    setOldFile(updatedFiles);
    const updatedFileAttachment = updatedFiles.map((file) => ({
      bill_attachment_id: file.id,
      file_id: "",
    }));
    setMergeFile((prevMergeFile) => [
      ...prevMergeFile,
      ...updatedFileAttachment,
    ]);
    formik.setFieldValue(fieldName, [...mergeFile, ...updatedFileAttachment]);
  };

  useEffect(() => {
    setOldFile(fileAttachment || []); // Ensure it's an array
  }, [fileAttachment]);

  return (
    <div className="mb-3">
      <div className="flex flex-col items-center">
        <div className="relative border-dashed border-2 border-gray-300 rounded-lg p-4 w-full">
          <div className="flex flex-col items-center mt-3">
            <img src={UploadIcon} alt="Upload Icon" className="w-16 h-16" />
            <p className="text-center mt-2">
              {(selectedFiles?.length > 0 || oldFile?.length > 0) && (
                <span>
                  {selectedFiles.length + oldFile.length} files
                </span>
              )}
              <br />
              Drag or drop file here or click
            </p>
          </div>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id={fieldName}
            onChange={handleFileChange}
            multiple
          />
        </div>
      </div>
      <div className="mt-3">
        {selectedFilesName.map((file, index) => (
          <span key={index} className="flex items-center justify-between">
            <span className="text-gray-700">{file.name}</span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(index)}
            >
              <i className="bi bi-shield-fill-x ms-1 fs-6"></i>
            </span>
          </span>
        ))}
        {oldFile.map((file, index) => (
          <span key={index} className="flex items-center justify-between">
            <span className="text-gray-700">{file?.file_upload?.name}</span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeOldFile(index)}
            >
              <i className="bi bi-shield-fill-x ms-1 fs-6"></i>
            </span>
          </span>
        ))}
      </div>

      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <div className="text-red-500 mt-2 text-sm">{formik.errors[fieldName]}</div>
      )}
    </div>
  );
}
