# Mini-Compiler

I built a small compiler for a BASIC-like language and took it further after the class ended. It handles the usual front-end phases: a hand-rolled lexer, a recursive‑descent parser based on the grammar below, and a simple code emitter that transpiles programs to C so they can be compiled with GCC.

The original version started as a school project; I kept iterating on it afterward (cleaned up the lexer state machine, tightened error messages, and added more test scripts). Because it began as coursework and still shares some scaffolding, I’m not posting a public repository. If you’re curious about specific parts, I’m happy to share snippets or walk through the design.

## What it supports

- Integer expressions with unary/binary operators
- Labels and gotos
- Conditionals (`if ... then ... endif`)
- Loops (`while ... repeat ... endwhile`)
- Input/assignment/print statements
- Transpilation to C as the backend target

## How it works (quick tour)

- Lexer: one pass, state-machine style, emitting tokens for keywords, identifiers, integers, strings, and operators (`==`, `!=`, `<=`, `>=`, `+`, `-`, `*`, `/`, `;`, etc.).
- Parser: straightforward recursive‑descent with functions mirroring the grammar (`program`, `statement`, `comparison`, `expression`, `term`, `unary`, `primary`).
- Emitter: writes out headers, a tiny symbol table for declarations, and C code corresponding to parsed statements. The result is a `.c` file you can compile with `gcc`.

## Grammar (spec I followed)

```
program         ::= {statement}
statement       ::= "print" (expression | string) semicolon
                  | "if" comparison "then" {statement} "endif"
                  | "while" comparison "repeat" {statement} "endwhile"
                  | "label" identifier semicolon
                  | "goto" identifier semicolon
                  | "let" identifier "=" expression semicolon
                  | "input" identifier semicolon
comparison      ::= expression (("==" | "!=" | ">" | ">=" | "<" | "<=") expression)+
expression      ::= term {( "-" | "+" ) term}
term            ::= unary {( "/" | "*" ) unary}
unary           ::= ["+" | "-"] primary
primary         ::= integer | identifier
```

## References I found helpful

- “Teeny Tiny Compiler” series (lexer, parser, code emitter)
- A weekend tutorial on writing a tiny compiler (good for the lexer as a state machine)

If you want a deeper dive into any part (e.g., comparison parsing or how I map statements to C), let me know and I can share a focused write-up. 





