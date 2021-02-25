package main

import (
	"net/http"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"github.com/gorilla/mux"
	"github.com/piquette/finance-go"
	"github.com/piquette/finance-go/quote"
	"github.com/piquette/finance-go/equity"
)

type Symbol struct {
	Ticket      string `json:"ticket"`
}

type Symbols struct {
	Tickets     []string `json:"tickets"`
}

type Quote struct {
	// Quote classifying fields.
	Symbol      string
	MarketState string
	QuoteType   string
	ShortName   string

	// Regular session quote data.
	RegularMarketChangePercent float64
	RegularMarketPreviousClose float64
	RegularMarketPrice         float64
	RegularMarketTime          int
	RegularMarketChange        float64
	RegularMarketOpen          float64
	RegularMarketDayHigh       float64
	RegularMarketDayLow        float64
	RegularMarketVolume        int

	// Quote depth.
	Bid     float64
	Ask     float64
	BidSize int
	AskSize int

	// Pre-market quote data.
	PreMarketPrice         float64
	PreMarketChange        float64
	PreMarketChangePercent float64
	PreMarketTime          int

	// Post-market quote data.
	PostMarketPrice         float64
	PostMarketChange        float64
	PostMarketChangePercent float64
	PostMarketTime          int

	// 52wk ranges.
	FiftyTwoWeekLowChange         float64
	FiftyTwoWeekLowChangePercent  float64
	FiftyTwoWeekHighChange        float64
	FiftyTwoWeekHighChangePercent float64
	FiftyTwoWeekLow               float64
	FiftyTwoWeekHigh              float64

	// Averages.
	FiftyDayAverage                   float64
	FiftyDayAverageChange             float64
	FiftyDayAverageChangePercent      float64
	TwoHundredDayAverage              float64
	TwoHundredDayAverageChange        float64
	TwoHundredDayAverageChangePercent float64

	// Volume metrics.
	AverageDailyVolume3Month int
	AverageDailyVolume10Day  int

	// Quote meta-data.
	QuoteSource               string
	CurrencyID                string
	IsTradeable               bool
	QuoteDelay                int
	FullExchangeName          string
	SourceInterval            int
	ExchangeTimezoneName      string
	ExchangeTimezoneShortName string
	GMTOffSetMilliseconds     int
	MarketID                  string
	ExchangeID                string
}

func GetQuote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	queryQuote := vars["quote"]
	fmt.Println(queryQuote)
	q, err := equity.Get(queryQuote)
	if err != nil {
		return
	}
	json.NewEncoder(w).Encode(q)
}

/* func GetQuota(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var ticket Symbol
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &ticket)
	if err != nil {
		return
	}
	q, err := quote.Get(ticket.Ticket)
	if err != nil {
		return
	}
	json.NewEncoder(w).Encode(q)
} */

func GetAllQuote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var tickets Symbols
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &tickets)
	if err != nil {
		return
	}
	var res []*finance.Quote
	iter := quote.List(tickets.Tickets)
	for iter.Next() {
		q := iter.Quote()
		res = append(res, q)
	}
	if iter.Err() != nil {
		return
	}
	json.NewEncoder(w).Encode(res)
}