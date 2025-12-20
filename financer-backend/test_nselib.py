import nselib
from nselib import capital_market
import pandas as pd

try:
    print("Fetching equity list...")
    df = capital_market.equity_list()
    print(f"Total stocks: {len(df)}")
    
    # Filter for Equity series only
    eq_df = df[df['SERIES'] == 'EQ']
    print(f"Equity series stocks: {len(eq_df)}")
    
    # Print first 10
    print(f"First 10: {eq_df['SYMBOL'].tolist()[:10]}")
    
except Exception as e:
    print(f"Error: {e}")
