---
title: Crypto Trader
date: 2024-06-01T00:00:00.000Z
link: https://github.com/Sammyalhashe/crypto_trader
---
- A cryptocurrency trading system in `C++20/23`, built on `Boost.Asio` and `Boost.Beast`, targeting the Coinbase Advanced Trade API.
- Dual WebSocket market-data clients — one synchronous, one asynchronous via `Boost.Asio` — with automatic reconnection and exponential backoff.
- Paper-trading engine that runs end to end against the live feed: configurable starting balance, commission modelling, FIFO/LIFO position management, and realized/unrealized PnL tracked over time.
- Dual-signal regime detection combining BTC macro trend with ETH/BTC rotation into a five-state market classifier, used to select between trend-following and mean-reversion strategies.
- `C++20` concepts for compile-time strategy constraints, `std::jthread` for cooperative cancellation, and a lock-free SPSC queue decoupling the socket thread from event logging.
- Tested with `GoogleTest`/`GMock`; documented with `Doxygen`; built with `CMake` and `Nix`, with `mold`/`lld` linking and GitHub Actions CI.
- Docs: <a href="https://crypto-trader-docs.salh.xyz">crypto-trader-docs.salh.xyz</a>
- See: <a href="https://github.com/Sammyalhashe/crypto_trader">https://github.com/Sammyalhashe/crypto_trader</a>
