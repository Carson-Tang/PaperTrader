package main


import (
	//"log"
	//"os"
	"os/exec"
	"fmt"
	"net/http"
	"encoding/json"
	//"github.com/gorilla/mux"
	"io/ioutil"
)

type ExecResponse struct {
	Message 	string 	`json:"message"`
	Error			bool 		`json:"error"`
}

type Code struct {
	Code		  string 	`json:"code"`
}

func runCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var code Code
	var res ExecResponse
	res.Error = false

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &code)
	if err != nil {
		res.Error = true
		res.Message = "Server Error"
		json.NewEncoder(w).Encode(res)
		return
	}

	fmt.Println(code.Code)

	text := []byte(code.Code)
	err = ioutil.WriteFile("/tmp/stockscript.py", text, 0644)

	stdoutStderr, err := exec.Command("/bin/python3", "/tmp/stockscript.py").CombinedOutput()

	if err != nil {
		res.Error = true
	}
	res.Message = string(stdoutStderr)
	json.NewEncoder(w).Encode(res)
}