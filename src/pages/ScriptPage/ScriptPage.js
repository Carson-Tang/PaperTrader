import React, { useState } from "react";
import './ScriptPage.css';
import TextEditor from '../../components/TextEditor/TextEditor';
import LoadingBar from '../../components/LoadingBars/LoadingBars';
import { BLUE, RED } from '../../constants/colors';
const codeController = require('../../controllers/codeController');

// NotSubmitted
// Waiting
// Received

const ScriptPage = () => {
  const [code, setCode] = useState("print('hello world'")
  const [state, setState] = useState("NotSubmitted")
  const [response, setResponse] = useState()

  const runCode = async () => {
    console.log(code)
    setState('Waiting')
    const res = await codeController.sendScript(code);
    console.log(res);
    setResponse(res);
    setState('Received')
  }

  return (
    <div class="container">
      <div class="left-half">
        <div class="">
          <TextEditor code={code} setCode={setCode}/>
          <button style={{ backgroundColor: BLUE }} onClick={() => runCode()}>Submit</button>
          { /* add symbol option, add time length */ }
        </div>
      </div>
      <div class="right-half">
        <div class="">
        {
          state === 'Waiting' ? 
          <LoadingBar /> :
          state === 'Received' ? 
          (
            response.error ? 
            <h1 style={{ color: RED, paddingTop: '20px' }}>Error: {response.message}</h1> : 
            <h1>GOOD: {response.message}</h1>
          ) :
          <></> 
        }
        </div>
      </div>
    </div>
  );
}
export default ScriptPage;