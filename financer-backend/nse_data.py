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

logger = logging.getLogger(__name__)


class NSEDataService:
    """Enhanced NSE data service with robust error handling and additional features"""

    def __init__(self):
        self.base_url = "https://www.nseindia.com"
        self.api_base = "https://www.nseindia.com/api"
        self.session = None
        self.ua = UserAgent()

        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1.0  # seconds

        # Initialize session
        self._init_session()

    def _init_session(self):
        """Initialize HTTP session with proper headers and retries"""
        self.session = requests.Session()

        # Retry strategy
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            backoff_factor=1,
            raise_on_status=False
        )

        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for NSE requests"""
        return {
            "User-Agent": self.ua.random,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Cache-Control": "max-age=0",
        }

    async def _rate_limit_wait(self):
        """Implement rate limiting"""
        current_time = asyncio.get_event_loop().time()
        time_since_last = current_time - self.last_request_time

        if time_since_last < self.min_request_interval:
            await asyncio.sleep(self.min_request_interval - time_since_last)

        self.last_request_time = asyncio.get_event_loop().time()

    def _establish_session(self) -> bool:
        """Establish session with NSE website"""
        try:
            # First request to get cookies
            response = self.session.get(
                self.base_url,
                headers=self._get_headers(),
                timeout=10
            )
            response.raise_for_status()

            # Wait and make second request
            import time
            time.sleep(1)

            response = self.session.get(
                f"{self.base_url}/market-data/live-equity-market",
                headers=self._get_headers(),
                timeout=10
            )
            response.raise_for_status()

            return True

        except Exception as e:
            logger.error(f"Session establishment failed: {e}")
            return False

    async def get_stock_data(self) -> Dict[str, Any]:
        """Get NSE stock market data"""
        try:
            await self._rate_limit_wait()

            if not self._establish_session():
                return {
                    "data": [],
                    "error": "Failed to establish NSE session",
                    "timestamp": datetime.utcnow().isoformat()
                }

            # Main API request
            url = f"{self.api_base}/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET"
            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=15
            )
            response.raise_for_status()

            raw_data = response.json()
            processed_data = self._process_stock_data(raw_data.get("data", []))

            return {
                "data": processed_data,
                "error": None,
                "timestamp": datetime.utcnow().isoformat(),
                "total_count": len(processed_data)
            }

        except requests.exceptions.Timeout:
            logger.error("NSE API request timeout")
            return {
                "data": [],
                "error": "Request timeout - NSE servers may be busy",
                "timestamp": datetime.utcnow().isoformat()
            }

        except requests.exceptions.HTTPError as e:
            logger.error(f"NSE API HTTP error: {e}")
            return {
                "data": [],
                "error": f"NSE API error: {e.response.status_code}",
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Unexpected error in get_stock_data: {e}")
            return {
                "data": [],
                "error": f"Unexpected error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }

    def _process_stock_data(self, raw_data: List[Dict]) -> List[Dict]:
        """Process and clean NSE stock data"""
        processed = []

        for stock in raw_data:
            try:
                # Extract and validate data
                symbol = stock.get("symbol", "").strip()
                if not symbol:
                    continue

                # Parse numeric values safely
                last_price = self._safe_float_parse(stock.get("lastPrice"))
                p_change = self._safe_float_parse(stock.get("pChange"))
                volume = self._safe_int_parse(stock.get("totalTradedVolume"))
                market_cap = self._safe_float_parse(stock.get("marketCapitalization"))

                processed_stock = {
                    "symbol": symbol,
                    "name": stock.get("companyName", symbol),
                    "price": last_price,
                    "change": p_change,
                    "change_percent": p_change,
                    "volume": volume,
                    "market_cap": market_cap,
                    "open": self._safe_float_parse(stock.get("open")),
                    "high": self._safe_float_parse(stock.get("dayHigh")),
                    "low": self._safe_float_parse(stock.get("dayLow")),
                    "previous_close": self._safe_float_parse(stock.get("previousClose")),
                    "sector": stock.get("industry", "Unknown"),
                    "last_updated": datetime.utcnow().isoformat(),
                    "raw_data": stock  # Keep original data for debugging
                }

                processed.append(processed_stock)

            except Exception as e:
                logger.warning(f"Error processing stock {stock.get('symbol', 'unknown')}: {e}")
                continue

        # Sort by market cap (descending)
        processed.sort(key=lambda x: x.get("market_cap", 0) or 0, reverse=True)

        return processed

    async def get_stock_detail(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific stock"""
        try:
            await self._rate_limit_wait()

            if not self._establish_session():
                return None

            # Get quote data
            url = f"{self.api_base}/quote-equity?symbol={symbol}"
            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=10
            )
            response.raise_for_status()

            data = response.json()

            if not data.get("info"):
                return None

            info = data["info"]
            price_info = data.get("priceInfo", {})
            security_info = data.get("securityInfo", {})

            return {
                "symbol": symbol,
                "name": info.get("companyName", symbol),
                "price": self._safe_float_parse(price_info.get("lastPrice")),
                "change": self._safe_float_parse(price_info.get("change")),
                "change_percent": self._safe_float_parse(price_info.get("pChange")),
                "volume": self._safe_int_parse(price_info.get("totalTradedVolume")),
                "market_cap": self._safe_float_parse(security_info.get("marketCapitalization")),
                "pe_ratio": self._safe_float_parse(security_info.get("pe")),
                "dividend_yield": self._safe_float_parse(security_info.get("dividendYield")),
                "sector": security_info.get("industry", "Unknown"),
                "open": self._safe_float_parse(price_info.get("open")),
                "high": self._safe_float_parse(price_info.get("intraDayHighLow", {}).get("max")),
                "low": self._safe_float_parse(price_info.get("intraDayHighLow", {}).get("min")),
                "previous_close": self._safe_float_parse(price_info.get("previousClose")),
                "last_updated": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error fetching stock detail for {symbol}: {e}")
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
        if self.session:
            self.session.close()
