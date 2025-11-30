# My Allocator

I built a custom memory allocator from scratch for my systems programming class. It implements the core memory management functions—malloc, calloc, and free—using system calls directly instead of relying on the standard library. After the class ended, I kept tweaking it to handle edge cases better and clean up the bookkeeping logic.

This started as a school assignment, and I expanded on it afterward (better error handling, cleaner block tracking, and some debugging helpers). Since it's based on coursework, I'm not posting the full repository publicly. Happy to walk through the design or share specific parts if you're curious.

## What it does

The allocator provides a drop-in replacement for malloc/calloc/free that programs can link against. It manages heap memory using a linked list of blocks, each with metadata tracking size, free status, and whether it came from sbrk or mmap.

## Design decisions

**Memory requests**: For allocations under 4096 bytes (including the header), I use `sbrk` to extend the program break. For larger allocations, I use `mmap` to get anonymous memory pages. This matches how many real allocators work—small stuff stays in the heap segment, big stuff gets its own pages.

**Data structure**: A linked list of block structures. Each block has:
- Size of the user-requested memory
- Pointer to the next block
- A free flag
- A flag indicating if it was mmap'd (needed for proper cleanup)

**Allocation strategy**: First-fit. When someone calls malloc, I walk the list from the head and grab the first free block that's big enough. It's not optimal for fragmentation, but it's fast and straightforward. The trade-off is that you might end up with smaller free chunks scattered around, but for this project it was the right balance.

**Reuse logic**: Before requesting new memory, the allocator scans existing blocks to see if any are free and large enough. If so, it marks that block as in-use and returns it. This avoids unnecessary system calls and keeps memory usage tighter.

## Implementation details

The block structure sits right before the actual memory returned to the user. When you call `mymalloc(100)`, I allocate space for the block header plus 100 bytes, then return a pointer to the byte right after the header. That way `myfree` can subtract one header size to find the metadata.

For calloc, I reuse the malloc logic and then zero out the memory. There's probably a more efficient way to do that with mmap (since anonymous pages start zeroed), but for consistency I just memset the whole range.

Free is pretty simple—just mark the block as free. I don't do coalescing (merging adjacent free blocks) in this version, though that would be a nice optimization. For mmap'd blocks, I actually call `munmap` to return the pages to the OS, since those are separate from the heap.

## Testing and debugging

Since you can't use valgrind with a custom allocator (it hooks into the standard malloc), I added some basic tracking to make sure allocations and frees balanced out. I also used `strace` to verify that sbrk and mmap were being called the right number of times—if you're reusing blocks properly, you shouldn't see a system call for every malloc.

The assignment required specific printf statements for debugging, which actually turned out to be pretty useful for understanding allocation patterns. You can see when memory is being reused vs when new chunks are requested.

## What I learned

Writing an allocator makes you think hard about memory layout, pointer arithmetic, and system calls. Getting the pointer math right (especially when converting between block pointers and user pointers) took some careful debugging. It's also a good reminder that malloc isn't magic—it's just careful bookkeeping and system calls under the hood.

The first-fit strategy is simple but has real trade-offs. In a production allocator, you'd probably want best-fit or a segregated free list to reduce fragmentation. But for learning purposes, first-fit hits the sweet spot of being understandable and still functional.

Since this was a class project that I built on afterward, I'm not sharing the full codebase publicly. If you want to dig into specific parts (like how I handle the sbrk vs mmap decision, or the block structure layout), I'm happy to explain or share snippets.

