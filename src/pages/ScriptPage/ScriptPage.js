import React, { useState } from "react";
import './ScriptPage.css';
import TextEditor from '../../components/TextEditor/TextEditor';

const ScriptPage = () => {
  const [code, setCode] = useState(`default code`)

  return (
    <div>
      <TextEditor code={code} setCode={setCode}/>
    </div>
  );
}
export default ScriptPage;