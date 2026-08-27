---
title: UDP Order Book
date: 2024-09-01T00:00:00.000Z
link: https://github.com/Sammyalhashe/udp_order_book
---
- A lock-free limit-order-book matching engine in `C++`, fed by order messages over `UDP`.
- Price-level ordered book with FIFO time priority within each level.
- Custom lock-free SPSC ring buffer for inter-thread event transport.
- Zero-copy message deserialization straight from the UDP datagram buffers.
- See: <a href="https://github.com/Sammyalhashe/udp_order_book">https://github.com/Sammyalhashe/udp_order_book</a>
