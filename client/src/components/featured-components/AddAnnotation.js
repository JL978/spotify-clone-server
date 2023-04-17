import React from "react";
import AddComment from "../footer-components/AddComment";

const AddAnnotation = ({ closeTip, token, annotatedText }) => {
  return (
    <div className="add-annotation" data-source="inside">
      <AddComment
        closeTip={closeTip}
        token={token}
        annotation={true}
        text={annotatedText}
      />
    </div>
  );
};

export default AddAnnotation;
