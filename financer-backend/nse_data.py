"""
Enhanced NSE Data Service with improved error handling, caching, and additional features.
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import math

import aiohttp
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from fake_useragent import UserAgent
import nselib
from nselib import capital_market
import pandas as pd

logger = logging.getLogger(__name__)


import yfinance as yf

class NSEDataService:
    """Enhanced NSE data service using yfinance for reliability"""

    def __init__(self):
        self.ua = UserAgent()
        self.tickers, self.company_names = self._get_all_nse_tickers()

    def _get_all_nse_tickers(self) -> tuple[List[str], Dict[str, str]]:
        """Fetch all NSE equity tickers dynamically"""
        default_tickers = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
            "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
            "LT.NS", "AXISBANK.NS", "ASIANPAINT.NS", "MARUTI.NS", "TITAN.NS",
            "BAJFINANCE.NS", "HCLTECH.NS", "SUNPHARMA.NS", "TATAMOTORS.NS", "ULTRACEMCO.NS",
            "POWERGRID.NS", "NTPC.NS", "M&M.NS", "ONGC.NS", "ADANIENT.NS",
            "ADANIPORTS.NS", "BAJAJFINSV.NS", "BPCL.NS", "BRITANNIA.NS", "CIPLA.NS",
            "COALINDIA.NS", "DIVISLAB.NS", "DRREDDY.NS", "EICHERMOT.NS", "GRASIM.NS",
            "HEROMOTOCO.NS", "HINDALCO.NS", "INDUSINDBK.NS", "JSWSTEEL.NS", "LTIM.NS",
            "NESTLEIND.NS", "SBILIFE.NS", "TATACONSUM.NS", "TATASTEEL.NS", "TECHM.NS",
            "UPL.NS", "WIPRO.NS", "APOLLOHOSP.NS", "BAJAJ-AUTO.NS"
        ]
        default_mapping = {t.replace(".NS", ""): t.replace(".NS", "") for t in default_tickers}
        
        try:
            logger.info("Fetching full NSE equity list...")
            df = capital_market.equity_list()
            
            # Clean column names (remove leading/trailing spaces)
            df.columns = df.columns.str.strip()
            
            # Filter for Equity series
            if 'SERIES' in df.columns:
                eq_df = df[df['SERIES'] == 'EQ']
                symbols = eq_df['SYMBOL'].tolist()
                names = eq_df['NAME OF COMPANY'].tolist()
                
                # Create mapping
                mapping = dict(zip(symbols, names))
                
                # Append .NS for yfinance
                ns_tickers = [f"{sym}.NS" for sym in symbols]
                logger.info(f"Successfully fetched {len(ns_tickers)} tickers from NSE.")
                return ns_tickers, mapping
            else:
                logger.warning("'SERIES' column not found in NSE data. Using default list.")
                return default_tickers, default_mapping
                
        except Exception as e:
            logger.error(f"Failed to fetch NSE ticker list: {e}. Using default list.")
            return default_tickers, default_mapping

    async def get_stock_data(self, skip: int = 0, limit: int = 20) -> Dict[str, Any]:
        """Get NSE stock market data using yfinance with batching and pagination"""
        try:
            processed_data = []
            
            # Calculate target tickers based on pagination
            total_tickers = len(self.tickers)
            end_index = min(skip + limit, total_tickers)
            target_tickers = self.tickers[skip:end_index]
            
            if not target_tickers:
                 return {
                    "data": [],
                    "error": None,
                    "timestamp": datetime.utcnow().isoformat(),
                    "total_count": total_tickers,
                    "has_more": False
                }

            chunk_size = 100 # Fetch 100 at a time to be safe (though limit might be smaller)
            
            loop = asyncio.get_event_loop()
            
            # Process target tickers in chunks
            for i in range(0, len(target_tickers), chunk_size):
                chunk = target_tickers[i:i + chunk_size]
                tickers_str = " ".join(chunk)
                
                try:
                    # Run yfinance download in a separate thread
                    data = await loop.run_in_executor(None, lambda: yf.download(tickers_str, period="1d", group_by='ticker', threads=True, progress=False))
                    
                    if data.empty:
                        continue
                        
                    for ticker in chunk:
                        try:
                            # Handle single ticker vs multiple ticker response structure
                            if len(chunk) == 1:
                                stock_data = data
                            else:
                                try:
                                    stock_data = data[ticker]
                                except KeyError:
                                    continue
                            
                            if stock_data.empty:
                                continue

                            # Get latest row
                            latest = stock_data.iloc[-1]
                            
                            # Check for NaN values which indicate missing data
                            if pd.isna(latest['Close']):
                                continue

                            # Calculate change
                            current_price = float(latest['Close'])
                            open_price = float(latest['Open'])
                            change = current_price - open_price
                            p_change = (change / open_price) * 100 if open_price else 0
                            
                            symbol = ticker.replace(".NS", "")
                            name = self.company_names.get(symbol, symbol)
                            
                            processed_stock = {
                                "symbol": symbol,
                                "name": name,
                                "lastPrice": f"{current_price:,.2f}",
                                "pChange": f"{p_change:+.2f}",
                                "change": change,
                                "change_percent": p_change,
                                "otherDetails": {
                                    "open": float(latest['Open']),
                                    "high": float(latest['High']),
                                    "low": float(latest['Low']),
                                    "volume": int(latest['Volume']) if not pd.isna(latest['Volume']) else 0,
                                    "chartToday": None
                                }
                            }
                            processed_data.append(processed_stock)
                            
                        except Exception as e:
                            # logger.warning(f"Error processing {ticker}: {e}")
                            continue
                            
                except Exception as e:
                    logger.error(f"Error fetching chunk {i}: {e}")
                    continue

            return {
                "data": processed_data,
                "error": None,
                "timestamp": datetime.utcnow().isoformat(),
                "total_count": total_tickers,
                "has_more": end_index < total_tickers
            }

        except Exception as e:
            logger.error(f"YFinance error: {e}")
            return {
                "data": [],
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def get_stock_detail(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific stock"""
        try:
            ticker = yf.Ticker(f"{symbol}.NS")
            info = ticker.info
            
            return {
                "symbol": symbol,
                "name": info.get("longName", symbol),
                "lastPrice": f"{info.get('currentPrice', 0):,.2f}",
                "pChange": f"{(info.get('currentPrice', 0) - info.get('previousClose', 0)) / info.get('previousClose', 1) * 100:+.2f}",
                "otherDetails": {
                    "open": info.get("open"),
                    "high": info.get("dayHigh"),
                    "low": info.get("dayLow"),
                    "volume": info.get("volume"),
                    "marketCap": info.get("marketCap"),
                    "pe": info.get("trailingPE"),
                    "sector": info.get("sector"),
                    "chartToday": None
                }
            }
        except Exception as e:
            logger.error(f"Error fetching detail for {symbol}: {e}")
            return None

    async def calculate_fd_returns(
        self,
        principal: float,
        rate: float,
        tenure: int,
        compounding_frequency: str = "quarterly"
    ) -> Dict[str, Any]:
        """Calculate Fixed Deposit returns"""
        try:
            # Convert annual rate to decimal
            annual_rate = rate / 100

            # Determine compounding periods per year
            freq_map = {
                "monthly": 12,
                "quarterly": 4,
                "half-yearly": 2,
                "yearly": 1
            }

            periods_per_year = freq_map.get(compounding_frequency, 4)
            total_periods = (tenure / 12) * periods_per_year

            # Calculate compound interest
            rate_per_period = annual_rate / periods_per_year
            maturity_amount = principal * (1 + rate_per_period) ** total_periods
            interest_earned = maturity_amount - principal

            # Calculate effective annual rate
            effective_rate = ((1 + rate_per_period) ** periods_per_year - 1) * 100

            # Generate breakdown
            breakdown = []
            current_amount = principal

            for period in range(1, int(total_periods) + 1):
                interest = current_amount * rate_per_period
                current_amount += interest

                breakdown.append({
                    "period": period,
                    "interest_earned": round(interest, 2),
                    "balance": round(current_amount, 2)
                })

            return {
                "principal": principal,
                "interest_earned": round(interest_earned, 2),
                "maturity_amount": round(maturity_amount, 2),
                "effective_rate": round(effective_rate, 2),
                "nominal_rate": rate,
                "tenure_months": tenure,
                "compounding_frequency": compounding_frequency,
                "breakdown": breakdown,
                "total_periods": len(breakdown)
            }

        except Exception as e:
            logger.error(f"FD calculation error: {e}")
            raise ValueError("Invalid FD calculation parameters")

    @staticmethod
    def _safe_float_parse(value: Any) -> Optional[float]:
        """Safely parse float values"""
        if value is None or value == "" or value == "N/A":
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _safe_int_parse(value: Any) -> Optional[int]:
        """Safely parse integer values"""
        if value is None or value == "" or value == "N/A":
            return None
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return None

    async def get_market_indices(self) -> Dict[str, Any]:
        """Get major market indices"""
        try:
            await self._rate_limit_wait()

            if not self._establish_session():
                return {"error": "Failed to establish session"}

            url = f"{self.api_base}/allIndices"
            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=10
            )
            response.raise_for_status()

            data = response.json()
            indices = []

            for index in data.get("data", []):
                if index.get("key") in ["NIFTY 50", "NIFTY BANK", "NIFTY IT", "NIFTY TOTAL MARKET"]:
                    indices.append({
                        "name": index.get("name"),
                        "value": self._safe_float_parse(index.get("last")),
                        "change": self._safe_float_parse(index.get("change")),
                        "change_percent": self._safe_float_parse(index.get("pChange")),
                        "last_updated": datetime.utcnow().isoformat()
                    })

            return {
                "indices": indices,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error fetching market indices: {e}")
            return {"error": str(e)}

    def __del__(self):
        """Cleanup session on destruction"""
        # No session to close with yfinance
        pass
