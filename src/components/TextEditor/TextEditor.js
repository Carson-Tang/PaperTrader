import React from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"

const TextEditor = (code, setCode) => {


  return (
    <div>
      <AceEditor
        mode="python"
        theme="monokai"
        onChange={text => setCode(text)}
        value={code}
        name="UNIQUE_ID_OF_DIV"
        fontSize={14}
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
      />
    </div>
  );
}
export default TextEditor;