package main

import (
	"net/http"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"github.com/gorilla/mux"
	"github.com/piquette/finance-go"
	"github.com/piquette/finance-go/chart"
	"github.com/piquette/finance-go/datetime"
	"github.com/piquette/finance-go/iter"
	"github.com/shopspring/decimal"
)

type Iter struct {
	*iter.Iter
}

// Params carries a context and chart information.
type Params struct {
	// Context access.
	finance.Params
	// Accessible fields.
	Symbol   string // requested symbol
	Start    *datetime.Datetime // start of the time period
	End      *datetime.Datetime // end of the time period
	Interval datetime.Interval // per-bar aggregation
	IncludeExt bool // include extended-hours
}

// ChartMeta is meta data associated with a chart response.
type ChartMeta struct {
	Currency             string    `json:"currency"`
	Symbol               string    `json:"symbol"`
	ExchangeName         string    `json:"exchangeName"`
	QuoteType            string    `json:"instrumentType"`
	FirstTradeDate       int       `json:"firstTradeDate"`
	Gmtoffset            int       `json:"gmtoffset"`
	Timezone             string    `json:"timezone"`
	ExchangeTimezoneName string    `json:"exchangeTimezoneName"`
	ChartPreviousClose   float64   `json:"chartPreviousClose"`
	CurrentTradingPeriod struct {
		Pre struct {
			Timezone  string `json:"timezone"`
			Start     int    `json:"start"`
			End       int    `json:"end"`
			Gmtoffset int    `json:"gmtoffset"`
		} `json:"pre"`
		Regular struct {
			Timezone  string `json:"timezone"`
			Start     int    `json:"start"`
			End       int    `json:"end"`
			Gmtoffset int    `json:"gmtoffset"`
		} `json:"regular"`
		Post struct {
			Timezone  string `json:"timezone"`
			Start     int    `json:"start"`
			End       int    `json:"end"`
			Gmtoffset int    `json:"gmtoffset"`
		} `json:"post"`
	} `json:"currentTradingPeriod"`
	DataGranularity string   `json:"dataGranularity"`
	ValidRanges     []string `json:"validRanges"`
}

// ChartBar is a single instance of a chart bar.
type ChartBar struct {
	Open      decimal.Decimal
	Low       decimal.Decimal
	High      decimal.Decimal
	Close     decimal.Decimal
	AdjClose  decimal.Decimal
	Volume    int
	Timestamp int
}

type ChartQuery struct {
	Symbol   string `json:"symbol"`
	Start struct {
		Month int `json:"month"`
		Day int `json:"day"`
		Year int `json:"year"`
	} `json:"start"`
	End struct {
		Month int `json:"month"`
		Day int `json:"day"`
		Year int `json:"year"`
	} `json:"end"`
	IncludeExt bool `json:"includeExt"` // include extended-hours
}

type TimePeriod struct {
	Start struct {
		Month int `json:"month"`
		Day int `json:"day"`
		Year int `json:"year"`
	} `json:"start"`
	End struct {
		Month int `json:"month"`
		Day int `json:"day"`
		Year int `json:"year"`
	} `json:"end"`
	Interval string `json:"interval"`
}

func GetChartBar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	queryQuote := vars["quote"]

	var timePeriod TimePeriod
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &timePeriod)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(timePeriod)

	interval := datetime.OneDay
	switch timePeriod.Interval {
	case "1m":
		interval = datetime.OneMin
	case "2m":
		interval = datetime.FifteenMins
	case "5m":
		interval = datetime.FiveMins
	case "15m":
		interval = datetime.FifteenMins
	case "30m":
		interval = datetime.ThirtyMins
	case "60m":
		interval = datetime.SixtyMins
	case "90m":
		interval = datetime.NinetyMins
	case "1h":
		interval = datetime.OneHour
	case "1d":
		interval = datetime.OneDay
	case "5d":
		interval = datetime.FiveDay
	case "1mo":
		interval = datetime.OneMonth
	case "3mo":
		interval = datetime.ThreeMonth
	case "6mo":
		interval = datetime.SixMonth
	case "1y":
		interval = datetime.OneYear
	case "2y":
		interval = datetime.TwoYear
	case "5y":
		interval = datetime.FiveYear
	case "10y":
		interval = datetime.TenYear
	case "ytd":
		interval = datetime.YTD
	case "max":
		interval = datetime.Max
	default:
		interval = datetime.Max
	}

	fmt.Println(interval)

	p := &chart.Params{
		Symbol:   queryQuote,
		Start:    &datetime.Datetime{
			Month: timePeriod.Start.Month, Day: timePeriod.Start.Day, Year: timePeriod.Start.Year},
		End:      &datetime.Datetime{
			Month: timePeriod.End.Month, Day: timePeriod.End.Day, Year: timePeriod.End.Year},
		Interval: interval,
	}

	iter := chart.Get(p)
	var res []*finance.ChartBar
	for iter.Next() {
		b := iter.Bar()
		res = append(res, b)	
	}
	if iter.Err() != nil {
		fmt.Println("gg2")
		fmt.Println(iter.Err())
		return
	}
	fmt.Println("gg")
	fmt.Println(res)
	json.NewEncoder(w).Encode(res)
}

/* func GetChartBar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var query ChartQuery
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &query)
	if err != nil {
		return
	}

	p := &chart.Params{
		Symbol:   query.Symbol,
		Start:    &datetime.Datetime{
			Month: query.Start.Month, Day: query.Start.Day, Year: query.Start.Year},
		End:      &datetime.Datetime{
			Month: query.End.Month, Day: query.End.Day, Year: query.End.Year},
		Interval: datetime.OneDay,
	}

	iter := chart.Get(p)
	var res []*finance.ChartBar
	for iter.Next() {
		b := iter.Bar()
		res = append(res, b)	
	}
	if iter.Err() != nil {
		return
	}
	json.NewEncoder(w).Encode(res)
} */

func GetChartMeta(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var query ChartQuery
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &query)
	if err != nil {
		return
	}
	p := &chart.Params{
		Symbol:   query.Symbol,
		Start:    &datetime.Datetime{
			Month: query.Start.Month, Day: query.Start.Day, Year: query.Start.Year},
		End:      &datetime.Datetime{
			Month: query.End.Month, Day: query.End.Day, Year: query.End.Year},
		Interval: datetime.OneDay,
	}

	iter := chart.Get(p)
	var res []*finance.ChartMeta
	for iter.Next() {
		m := iter.Meta()
		res = append(res, &m)
	}
	if iter.Err() != nil {
		return
	}
	json.NewEncoder(w).Encode(res)
}