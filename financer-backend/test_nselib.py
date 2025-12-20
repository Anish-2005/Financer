import nselib
from nselib import capital_market
import pandas as pd

import nselib
from nselib import capital_market
import pandas as pd
import yfinance as yf
import time

try:
    print("Fetching equity list...")
    df = capital_market.equity_list()
    df.columns = df.columns.str.strip()
    
    if 'SERIES' in df.columns:
        eq_df = df[df['SERIES'] == 'EQ']
        symbols = eq_df['SYMBOL'].tolist()
        ns_tickers = [f"{sym}.NS" for sym in symbols]
        print(f"Total tickers: {len(ns_tickers)}")
        
        # Test with first 100 tickers to be safe, or maybe 500
        test_tickers = ns_tickers[:100] 
        print(f"Testing download for {len(test_tickers)} tickers...")
        
        start_time = time.time()
        data = yf.download(test_tickers, period="1d", group_by='ticker', threads=True)
        end_time = time.time()
        
        print(f"Download took {end_time - start_time:.2f} seconds")
        print(f"Data shape: {data.shape}")
        
    else:
        print("SERIES column not found.")
    
except Exception as e:
    print(f"Error: {e}")
