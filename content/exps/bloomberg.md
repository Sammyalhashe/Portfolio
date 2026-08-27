---
title: Bloomberg — Senior Software Engineer
date: 2025-03-01
type: experience
---

* Core developer on an internal `C++` pub/sub middleware that streams real-time market data to Bloomberg Terminal clients across IB, MSG, and GP.
    * A single broker hosts 100+ independently entitled and rate-limited publishing models. The engineering problem is fan-out and per-model isolation — keeping mostly-idle models near-zero-cost while active ones can't starve each other — rather than raw throughput.
* Added two-way metadata exchange, so subscribers can retune subscription parameters in place.
    * Previously callers either paid a two-round-trip unsubscribe/resubscribe, or leaned on a fragile convention of smuggling parameters through unrelated subscription fields for the publisher to string-parse.
* Collapsed the settings pipeline to a single JSON field.
    * Adding a setting used to require a lockstep schema update across the database, the settings service, and the client. Whichever deployed first broke things: a new client would have its requests dropped, and a new server would crash clients decoding fields they didn't expect. With one JSON payload the wire contract never changes, so the client feature-detects fields instead of crashing on them.
* Integrating company-wide routing and entitlement libraries into the framework, replacing per-team configuration with a unified request-routing and access-control layer. Currently in alpha and rolling out team by team.
* Own and maintain the Cython binding layer that exposes the `C++` SDK to Python consumers — adopted by 50+ application teams as the primary Python entry point to the middleware.
* Extended the framework to web clients over HTTP: JWT-secured JSON transport behind an nginx reverse proxy, plus an OpenAPI specification and JavaScript client SDK standardizing web-client integration.
* Wrote a `Python` bot that triages roughly 25 false-positive alerts a week over Kafka with batched HTTP requests. Each alert previously took about five minutes of manually cross-referencing the affected machines against open maintenance tickets, so this returns ~2 engineer-hours a week to the team.
* Presented *Atomics Under the Hood* at Bloomberg's internal conference — what `std::atomic` compiles to on x86, how MESI cache coherency underpins it, and the ways atomics get misused.
* Presented *Sequence Locks* to the C++ Guild's inter-thread communication working group — seqlock design for low-overhead concurrent reads of rarely-updated shared data. I review multithreaded code in that working group.
