# Mini-shell

A Unix shell implementation in C that I built for a systems programming class. This was definitely one of the more challenging projects I've worked on, but it taught me a lot about how operating systems work under the hood.

# How It Started
This was assigned as a major project in my systems programming course. The goal was to build a functional shell that could handle basic Unix commands, pipelines, and process management. At first, I wasn't sure how complex it would be, but it turned out to be quite involved.

# The Challenge
Working with low-level system calls like `fork()`, `execvp()`, and `waitpid()` was tricky at first. Understanding how processes are created, how they communicate through pipes, and how signals work took some time to wrap my head around. The most difficult part was getting the job control working properly - managing foreground and background processes, handling signals like SIGINT and SIGTSTP, and keeping track of process states.

# What I Built
The shell supports all the basic features you'd expect: command execution, input/output redirection, pipelines with the `|` operator, and conditional operators like `&&` and `||`. It also handles background processes with `&` and includes built-in commands like `cd`, `exit`, `history`, and `jobs`.

The job control was probably the most interesting part - being able to suspend processes with Ctrl+Z, bring them back to the foreground with `fg`, or run them in the background with `bg`. Getting the signal handling right so that processes behave correctly was a real learning experience.

# Technical Details
I used C for the entire implementation, which meant dealing with manual memory management and pointer arithmetic. The shell parses user input into tokens, builds a linked list of command structures, and executes them using the appropriate system calls. Process management involves tracking job states (Running, Stopped, Done) and handling the transitions between them.

# Future Plans
Since this was a class project, I can't share the code publicly, but I'm planning to polish it up and maybe add some additional features. I'd like to improve the command history functionality and maybe add some more advanced features like tab completion or command aliases. It was a great learning opportunity, even though it was pretty difficult at times.

# What I Learned
This project really deepened my understanding of how operating systems work. Learning about process creation, inter-process communication, and signal handling gave me a much better appreciation for what's happening when I use a terminal. It also taught me a lot about debugging complex systems - when you're dealing with multiple processes and signals, things can get pretty tricky to trace through.

