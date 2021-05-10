package main

import (
	_"context"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"fmt"
	//"go.mongodb.org/mongo-driver/mongo"
	//"go.mongodb.org/mongo-driver/mongo/options"
)

/* func GetDBCollection() (*mongo.Collection, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return nil, err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, err
	}
	collection := client.Database("GoLogin").Collection("users")
	return collection, nil
} */

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/runCode", runCode).Methods("POST")

	r.HandleFunc("/quote/{quote}", GetQuote).Methods("GET")
	r.HandleFunc("/quotes", GetAllQuote).Methods("POST")
	//r.HandleFunc("/GetQuote", GetQuota).Methods("GET")
	r.HandleFunc("/chart/{quote}", GetChartBar).Methods("POST")

	/* r.HandleFunc("/GetAllQuote", GetAllQuote).Methods("GET")
	r.HandleFunc("/GetChartBar", GetChartBar).Methods("GET")
	r.HandleFunc("/GetChartMeta", GetChartMeta).Methods("GET") */
	
	fmt.Println("Server is running")
	corsWrapper := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type", "Origin", "Accept", "*"},
	})
	http.ListenAndServe(":8080", corsWrapper.Handler(r))
	//log.Fatal(http.ListenAndServe(":8080", r))
}