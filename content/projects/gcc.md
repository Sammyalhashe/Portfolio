---
title: GCC — strict-aliasing diagnostic fix
date: 2026-08-26T21:50:07.000Z
link: https://github.com/gcc-mirror/gcc/commit/39ba948f9b86e136395b6edfe167ac7ba7232928
---
- Authored `c-family: honor explicit -Wstrict-aliasing under -fno-strict-aliasing`, merged upstream into GCC (commit `39ba948`).
- Previously the front-end aliasing diagnostic was silenced by `-fno-strict-aliasing` even when the user had explicitly asked for the warning. The patch makes the type-based check run regardless of whether the optimization is enabled, but only when `-Wstrict-aliasing` was requested explicitly — behaviour under `-Wall` is deliberately unchanged.
- Implemented by scoping a temporary `flag_strict_aliasing` override around the alias-set queries in `strict_aliasing_warning()`, gated on `OPTION_SET_P (warn_strict_aliasing)`.
- Hoisted the `temp_override` class and `make_temp_override` helper out of `cp-tree.h` into `c-common.h` so both the C and C++ front ends can use them.
- Added `c-c++-common` regression tests covering the explicit and `-Wall`-implied cases, and updated `doc/invoke.texi`.
- See: <a href="https://github.com/gcc-mirror/gcc/commit/39ba948f9b86e136395b6edfe167ac7ba7232928">the commit on gcc-mirror</a>
