import React from "react";

export default function DocGrid({docGridTitles, docGridElements}) {
    return (
        <div className="doc-admin-management-documents-grid">
            {docGridTitles}
            {docGridElements}
        </div>
    );
}
